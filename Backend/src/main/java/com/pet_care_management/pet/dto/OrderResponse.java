package com.pet_care_management.pet.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.pet_care_management.pet.entity.Order;
import com.pet_care_management.pet.entity.OrderItem;

public class OrderResponse {
    private Integer id;
    private String username;
    private List<OrderItemResponse> items;
    private Integer totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private String address;
    private String phone;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.username = order.getUser().getUsername();
        this.items = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            this.items.add(new OrderItemResponse(item));
        }
        this.totalAmount = order.getTotalAmount();
        this.status = order.getStatus();
        this.createdAt = order.getCreatedAt();
        this.address = order.getAddress();
        this.phone = order.getPhone();
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public static class OrderItemResponse {
        private Integer productId;
        private String productName;
        private Integer quantity;
        private Integer unitPrice;
        private Integer subtotal;

        public OrderItemResponse(OrderItem item) {
            this.productId = item.getProduct().getId();
            this.productName = item.getProduct().getName();
            this.quantity = item.getQuantity();
            this.unitPrice = item.getUnitPrice();
            this.subtotal = item.getSubtotal();
        }

        // Getters
        public Integer getProductId() {
            return productId;
        }

        public String getProductName() {
            return productName;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public Integer getUnitPrice() {
            return unitPrice;
        }

        public Integer getSubtotal() {
            return subtotal;
        }
    }

    // DTO cho thống kê doanh thu sản phẩm
    public static class ProductRevenueDTO {
        private Integer productId;
        private String productName;
        private Integer price;
        private Integer totalQuantity;
        private Integer totalRevenue;

        public ProductRevenueDTO(Integer productId, String productName, Integer price, Integer totalQuantity, Integer totalRevenue) {
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.totalQuantity = totalQuantity;
            this.totalRevenue = totalRevenue;
        }
        public Integer getProductId() { return productId; }
        public String getProductName() { return productName; }
        public Integer getPrice() { return price; }
        public Integer getTotalQuantity() { return totalQuantity; }
        public Integer getTotalRevenue() { return totalRevenue; }
        public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }
        public void setTotalRevenue(Integer totalRevenue) { this.totalRevenue = totalRevenue; }
    }
} 