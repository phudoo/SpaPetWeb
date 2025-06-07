package com.pet_care_management.pet.service.impl;

import com.pet_care_management.pet.dto.CartRequest;
import com.pet_care_management.pet.dto.CartResponse;
import com.pet_care_management.pet.entity.Cart;
import com.pet_care_management.pet.entity.Product;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.CartRepository;
import com.pet_care_management.pet.repository.ProductRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public CartResponse addToCart(Integer userId, CartRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Cart request cannot be null");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        // Get user
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Get product
        Optional<Product> productOpt = productRepository.findById(request.getProductId());
        if (!productOpt.isPresent()) {
            throw new RuntimeException("Product not found");
        }
        Product product = productOpt.get();

        // Check if product is already in cart
        Optional<Cart> existingCartOpt = cartRepository.findByUserIdAndProductId(userId, request.getProductId());
        Cart cart;
        
        if (!existingCartOpt.isPresent()) {
            cart = new Cart();
            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(request.getQuantity());
        } else {
            cart = existingCartOpt.get();
            int newQuantity = cart.getQuantity() + request.getQuantity();
            if (request.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }
            cart.setQuantity(newQuantity);
        }

        // Check stock
        if (cart.getQuantity() > product.getStock()) {
            throw new RuntimeException("Insufficient stock");
        }

        cart = cartRepository.save(cart);
        return new CartResponse(cart);
    }

    @Override
    public List<CartResponse> getCartItems(Integer userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        List<CartResponse> responses = new ArrayList<>();
        for (Cart cart : cartItems) {
            responses.add(new CartResponse(cart));
        }
        return responses;
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(Integer userId, Integer cartId, CartRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Cart request cannot be null");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (!cartOpt.isPresent()) {
            throw new RuntimeException("Cart item not found");
        }
        Cart cart = cartOpt.get();

        // Check authorization
        if (!cart.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this cart item");
        }

        // Check stock
        if (request.getQuantity() > cart.getProduct().getStock()) {
            throw new RuntimeException("Insufficient stock");
        }

        cart.setQuantity(request.getQuantity());
        cart = cartRepository.save(cart);
        return new CartResponse(cart);
    }

    @Override
    @Transactional
    public void removeFromCart(Integer userId, Integer cartId) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (!cartOpt.isPresent()) {
            throw new RuntimeException("Cart item not found");
        }
        Cart cart = cartOpt.get();

        // Check authorization
        if (!cart.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to remove this cart item");
        }

        cartRepository.delete(cart);
    }

    @Override
    @Transactional
    public void clearCart(Integer userId) {
        cartRepository.deleteByUserId(userId);
    }
} 