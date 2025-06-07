package com.pet_care_management.pet.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pet_care_management.pet.dto.OrderResponse;
import com.pet_care_management.pet.dto.OrderResponse.ProductRevenueDTO;
import com.pet_care_management.pet.entity.Cart;
import com.pet_care_management.pet.entity.Order;
import com.pet_care_management.pet.entity.OrderItem;
import com.pet_care_management.pet.entity.Product;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.CartRepository;
import com.pet_care_management.pet.repository.OrderRepository;
import com.pet_care_management.pet.repository.ProductRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(String username, List<com.pet_care_management.pet.dto.OrderRequest.OrderItemRequest> items, String address, String phone) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order items cannot be null or empty");
        }
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("Address cannot be null or empty");
        }
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone cannot be null or empty");
        }

        // Get user
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Get cart items
        List<Cart> cartItems = cartRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setAddress(address);
        order.setPhone(phone);

        List<OrderItem> orderItems = new ArrayList<>();
        int totalAmount = 0;

        // Process each item
        for (com.pet_care_management.pet.dto.OrderRequest.OrderItemRequest reqItem : items) {
            // Find corresponding cart item
            Optional<Cart> cartOpt = cartItems.stream()
                    .filter(c -> c.getProduct().getId().equals(reqItem.getProductId()))
                    .findFirst();
            if (!cartOpt.isPresent()) {
                throw new RuntimeException("Product id " + reqItem.getProductId() + " not found in your cart");
            }
            Cart cart = cartOpt.get();

            // Validate quantity
            if (reqItem.getQuantity() == null || reqItem.getQuantity() <= 0) {
                throw new RuntimeException("Invalid quantity for product id: " + reqItem.getProductId());
            }
            if (cart.getQuantity() < reqItem.getQuantity()) {
                throw new RuntimeException("Not enough quantity in your cart for product: " + cart.getProduct().getName());
            }

            // Check stock
            Product product = cart.getProduct();
            if (product.getStock() < reqItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(reqItem.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice() * reqItem.getQuantity());
            orderItems.add(orderItem);
            totalAmount += orderItem.getSubtotal();

            // Update stock
            product.setStock(product.getStock() - reqItem.getQuantity());
            productRepository.save(product);

            // Update cart
            int newCartQty = cart.getQuantity() - reqItem.getQuantity();
            if (newCartQty > 0) {
                cart.setQuantity(newCartQty);
                cartRepository.save(cart);
            } else {
                cartRepository.delete(cart);
            }
        }

        // Save order
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        return new OrderResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getOrdersByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        List<Order> orders = orderRepository.findByUserId(user.getId());
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(new OrderResponse(order));
        }
        return responses;
    }

    @Override
    public OrderResponse getOrder(Integer id, String username) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }
        Order order = orderOpt.get();

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Check authorization
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to view this order");
        }

        return new OrderResponse(order);
    }

    @Override
    @Transactional
    public void cancelOrder(Integer id, String username) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }
        Order order = orderOpt.get();

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Check authorization
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to cancel this order");
        }

        // Check if order can be cancelled
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Can only cancel pending orders");
        }

        // Return items to stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUser(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid status: " + status);
        }
        return orderRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Integer id, String status) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }
        Order order = orderOpt.get();

        // Validate status
        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid status: " + status);
        }

        // Check if status transition is valid
        if (!isValidStatusTransition(order.getStatus(), status)) {
            throw new RuntimeException("Invalid status transition from " + order.getStatus() + " to " + status);
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }

    private boolean isValidStatus(String status) {
        return status != null && 
               (status.equals("PENDING") || 
                status.equals("CONFIRMED") ||
                status.equals("COMPLETED") || 
                status.equals("CANCELLED"));
    }

    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        if (currentStatus.equals("CANCELLED")) {
            return false; // Cannot change status of cancelled orders
        }
        if (currentStatus.equals("COMPLETED")) {
            return false; // Cannot change status of completed orders
        }
        if (currentStatus.equals("PENDING")) {
            return newStatus.equals("CONFIRMED") || newStatus.equals("CANCELLED");
        }
        if (currentStatus.equals("CONFIRMED")) {
            return newStatus.equals("COMPLETED") || newStatus.equals("CANCELLED");
        }
        return false;
    }

    @Override
    @Transactional
    public OrderResponse confirmOrder(Integer id, String username) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }
        Order order = orderOpt.get();

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Check authorization
        String role = user.getRole().getName();
        if (!role.equalsIgnoreCase("admin") && !role.equalsIgnoreCase("doctor")) {
            throw new RuntimeException("You don't have permission to confirm this order");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Only pending orders can be confirmed");
        }

        order.setStatus("CONFIRMED");
        orderRepository.save(order);
        return new OrderResponse(order);
    }

    @Override
    public Map<String, Object> getProductRevenueStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findAll();
        List<Order> completedOrders = new ArrayList<>();
        
        // Filter completed orders within date range
        for (Order order : orders) {
            if (order.getCreatedAt().isAfter(startDate) && 
                order.getCreatedAt().isBefore(endDate) &&
                "COMPLETED".equals(order.getStatus())) {
                completedOrders.add(order);
            }
        }

        Map<Integer, ProductRevenueDTO> productStats = new HashMap<>();
        int totalRevenue = 0;

        // Calculate statistics for each product
        for (Order order : completedOrders) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                int itemRevenue = item.getSubtotal();
                totalRevenue += itemRevenue;

                ProductRevenueDTO dto = productStats.computeIfAbsent(product.getId(), k ->
                    new ProductRevenueDTO(product.getId(), product.getName(), product.getPrice(), 0, 0)
                );
                dto.setTotalQuantity(dto.getTotalQuantity() + item.getQuantity());
                dto.setTotalRevenue(dto.getTotalRevenue() + itemRevenue);
            }
        }

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalRevenue", totalRevenue);
        statistics.put("products", new ArrayList<>(productStats.values()));
        statistics.put("startDate", startDate);
        statistics.put("endDate", endDate);
        return statistics;
    }

    @Override
    public List<Map<String, Object>> getDetailedProductRevenueReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findAll();
        List<Order> completedOrders = new ArrayList<>();
        
        // Filter completed orders within date range
        for (Order order : orders) {
            if (order.getCreatedAt().isAfter(startDate) && 
                order.getCreatedAt().isBefore(endDate) &&
                "COMPLETED".equals(order.getStatus())) {
                completedOrders.add(order);
            }
        }

        Map<Integer, Map<String, Object>> productStats = new HashMap<>();

        // Calculate detailed statistics for each product
        for (Order order : completedOrders) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                Map<String, Object> stats = productStats.computeIfAbsent(product.getId(), k -> {
                    Map<String, Object> newStats = new HashMap<>();
                    newStats.put("productId", product.getId());
                    newStats.put("productName", product.getName());
                    newStats.put("totalRevenue", 0);
                    newStats.put("totalQuantity", 0);
                    newStats.put("orders", 0);
                    return newStats;
                });

                stats.put("totalRevenue", (Integer) stats.get("totalRevenue") + item.getSubtotal());
                stats.put("totalQuantity", (Integer) stats.get("totalQuantity") + item.getQuantity());
                stats.put("orders", (Integer) stats.get("orders") + 1);
            }
        }

        return new ArrayList<>(productStats.values());
    }
} 