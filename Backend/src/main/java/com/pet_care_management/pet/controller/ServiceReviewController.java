package com.pet_care_management.pet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pet_care_management.pet.dto.ServiceReviewRequest;
import com.pet_care_management.pet.dto.ServiceReviewResponse;
import com.pet_care_management.pet.entity.ServiceReview;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.ServiceReviewService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ServiceReviewController {
    @Autowired
    private ServiceReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ServiceReviewRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            ServiceReview review = reviewService.createReview(username, request.getServiceId(), request.getAppointmentId(), request.getRating(), request.getComment());
            return ResponseEntity.ok(new ServiceReviewResponse(review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ServiceReview>> getReviewsByService(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ServiceReview>> getReviewsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Integer reviewId,
            @RequestBody ServiceReviewRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ServiceReviewResponse response = reviewService.updateReview(username, reviewId, request.getRating(), request.getComment());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Integer reviewId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            String role = user.getRole().getName();
            reviewService.deleteReview(username, reviewId, role);
            return ResponseEntity.ok("Xóa đánh giá thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReviewDetail(@PathVariable Integer reviewId) {
        try {
            ServiceReview review = reviewService.getReviewById(reviewId);
            return ResponseEntity.ok(new ServiceReviewResponse(review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 