package com.pet_care_management.pet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pet_care_management.pet.entity.ServiceReview;

@Repository
public interface ServiceReviewRepository extends JpaRepository<ServiceReview, Integer> {
    List<ServiceReview> findByServiceId(Integer serviceId);
    List<ServiceReview> findByUserId(Integer userId);
    List<ServiceReview> findByAppointmentId(Integer appointmentId);
    boolean existsByUserIdAndServiceIdAndAppointmentId(Integer userId, Integer serviceId, Integer appointmentId);
} 