package com.pet_care_management.pet.service;

import java.util.List;

import com.pet_care_management.pet.entity.ServiceReview;
import com.pet_care_management.pet.dto.ServiceReviewResponse;

public interface ServiceReviewService {
    ServiceReview createReview(String username, Integer serviceId, Integer appointmentId, Integer rating, String comment);
    List<ServiceReview> getReviewsByService(Integer serviceId);
    List<ServiceReview> getReviewsByUser(Integer userId);
    ServiceReviewResponse updateReview(String username, Integer reviewId, Integer rating, String comment);
    void deleteReview(String username, Integer reviewId, String role);
    ServiceReview getReviewById(Integer reviewId);
} 