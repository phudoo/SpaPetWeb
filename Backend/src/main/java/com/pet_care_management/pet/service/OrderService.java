package com.pet_care_management.pet.service;
 
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.pet_care_management.pet.dto.OrderResponse;
import com.pet_care_management.pet.entity.Order;

public interface OrderService {
    OrderResponse createOrder(String username, List<com.pet_care_management.pet.dto.OrderRequest.OrderItemRequest> items, String address, String phone);
    List<OrderResponse> getOrdersByUsername(String username);
    OrderResponse getOrder(Integer id, String username);
    void cancelOrder(Integer id, String username);
    
    // Admin operations
    List<Order> getAllOrders();
    List<Order> getOrdersByUser(Integer userId);
    List<Order> getOrdersByStatus(String status);
    Order updateOrderStatus(Integer id, String status);
    OrderResponse confirmOrder(Integer id, String username);

    // Product revenue statistics
    Map<String, Object> getProductRevenueStatistics(LocalDateTime startDate, LocalDateTime endDate);
    List<Map<String, Object>> getDetailedProductRevenueReport(LocalDateTime startDate, LocalDateTime endDate);
}