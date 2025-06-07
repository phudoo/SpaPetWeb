package com.pet_care_management.pet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pet_care_management.pet.dto.CartRequest;
import com.pet_care_management.pet.service.CartService;
import com.pet_care_management.pet.service.UserService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    private boolean isAuthorized(Integer userId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) return false;
        Integer currentUserId = userService.findByUsername(authentication.getName()).getId();
        return userId.equals(currentUserId);
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addToCart(
            @PathVariable Integer userId,
            @RequestBody CartRequest request,
            Authentication authentication) {
        if (!isAuthorized(userId, authentication)) {
            return ResponseEntity.status(403).body("Not authorized to access this cart");
        }
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCartItems(@PathVariable Integer userId, Authentication authentication) {
        if (!isAuthorized(userId, authentication)) {
            return ResponseEntity.status(403).body("Not authorized to access this cart");
        }
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PutMapping("/user/{userId}/item/{cartId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer cartId,
            @RequestBody CartRequest request,
            Authentication authentication) {
        if (!isAuthorized(userId, authentication)) {
            return ResponseEntity.status(403).body("Not authorized to access this cart");
        }
        return ResponseEntity.ok(cartService.updateCartItem(userId, cartId, request));
    }

    @DeleteMapping("/user/{userId}/item/{cartId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Integer userId,
            @PathVariable Integer cartId,
            Authentication authentication) {
        if (!isAuthorized(userId, authentication)) {
            return ResponseEntity.status(403).body("Not authorized to access this cart");
        }
        cartService.removeFromCart(userId, cartId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> clearCart(@PathVariable Integer userId, Authentication authentication) {
        if (!isAuthorized(userId, authentication)) {
            return ResponseEntity.status(403).body("Not authorized to access this cart");
        }
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
} 