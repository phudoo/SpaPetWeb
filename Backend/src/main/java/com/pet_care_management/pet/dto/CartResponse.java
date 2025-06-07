package com.pet_care_management.pet.dto;

import java.time.LocalDateTime;

import com.pet_care_management.pet.entity.Cart;
import com.pet_care_management.pet.entity.Product;

public class CartResponse {
    private Integer id;
    private ProductInfo product;
    private Integer quantity;
    private LocalDateTime addedAt;
    private Integer totalPrice;

    public CartResponse(Cart cart) {
        this.id = cart.getId();
        this.product = new ProductInfo(cart.getProduct());
        this.quantity = cart.getQuantity();
        this.addedAt = cart.getAddedAt();
        this.totalPrice = cart.getProduct().getPrice() * cart.getQuantity();
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public ProductInfo getProduct() {
        return product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public Integer getTotalPrice() {
        return totalPrice;
    }

    // Inner class for Product info
    public static class ProductInfo {
        private Integer id;
        private String name;
        private String description;
        private Integer price;
        private Integer stock;

        public ProductInfo(Product product) {
            this.id = product.getId();
            this.name = product.getName();
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.stock = product.getStock();
        }

        // Getters
        public Integer getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        public Integer getPrice() {
            return price;
        }

        public Integer getStock() {
            return stock;
        }
    }
} 