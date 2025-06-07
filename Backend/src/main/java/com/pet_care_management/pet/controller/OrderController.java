package com.pet_care_management.pet.controller;

import com.pet_care_management.pet.dto.OrderRequest;
import com.pet_care_management.pet.dto.OrderResponse;
import com.pet_care_management.pet.entity.Order;
import com.pet_care_management.pet.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest orderRequest,
            Authentication authentication) {
        try {
            OrderResponse order = orderService.createOrder(
                authentication.getName(),
                orderRequest.getItems(),
                orderRequest.getAddress(),
                orderRequest.getPhone()
            );
            return new ResponseEntity<>(order, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByUsername(authentication.getName());
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrder(
            @PathVariable Integer id,
            Authentication authentication) {
        try {
            OrderResponse order = orderService.getOrder(id, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Integer id,
            Authentication authentication) {
        try {
            orderService.cancelOrder(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> responses = orderService.getAllOrders().stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable Integer userId) {
        List<OrderResponse> responses = orderService.getOrdersByUser(userId).stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable String status) {
        List<OrderResponse> responses = orderService.getOrdersByStatus(status).stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(new OrderResponse(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<?> confirmOrder(@PathVariable Integer id, Authentication authentication) {
        try {
            OrderResponse order = orderService.confirmOrder(id, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 