package com.pet_care_management.pet.service;

import com.pet_care_management.pet.dto.CartRequest;
import com.pet_care_management.pet.dto.CartResponse;
import java.util.List;

public interface CartService {
    CartResponse addToCart(Integer userId, CartRequest request);
    List<CartResponse> getCartItems(Integer userId);
    CartResponse updateCartItem(Integer userId, Integer cartId, CartRequest request);
    void removeFromCart(Integer userId, Integer cartId);
    void clearCart(Integer userId);
} 