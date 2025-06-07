package com.pet_care_management.pet.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.pet_care_management.pet.entity.Appointment;
import com.pet_care_management.pet.entity.ServiceReview;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.AppointmentRepository;
import com.pet_care_management.pet.repository.ServiceRepository;
import com.pet_care_management.pet.repository.ServiceReviewRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.ServiceReviewService;
import org.springframework.stereotype.Service;
import com.pet_care_management.pet.dto.ServiceReviewResponse;

@Service
public class ServiceReviewServiceImpl implements ServiceReviewService {
    @Autowired
    private ServiceReviewRepository reviewRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ServiceReview createReview(String username, Integer serviceId, Integer appointmentId, Integer rating, String comment) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (serviceId == null || appointmentId == null || rating == null) {
            throw new IllegalArgumentException("ServiceId, appointmentId, and rating cannot be null");
        }
        // Get user
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        Integer userId = user.getId();
        // Get appointment
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (!appointmentOpt.isPresent()) {
            throw new RuntimeException("Appointment not found");
        }
        Appointment appointment = appointmentOpt.get();
        if (!"COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Chỉ được đánh giá dịch vụ đã hoàn thành!");
        }
        // Check user is owner of appointment
        if (!appointment.getPet().getOwner().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền đánh giá lịch này!");
        }
        // Check service belongs to appointment
        boolean hasService = appointment.getServices().stream().anyMatch(s -> s.getId().equals(serviceId));
        if (!hasService) {
            throw new RuntimeException("Dịch vụ không thuộc lịch này!");
        }
        // Check already reviewed
        if (reviewRepository.existsByUserIdAndServiceIdAndAppointmentId(userId, serviceId, appointmentId)) {
            throw new RuntimeException("Bạn đã đánh giá dịch vụ này cho lịch này!");
        }
        // Get service
        Optional<com.pet_care_management.pet.entity.Service> serviceOpt = serviceRepository.findById(serviceId);
        if (!serviceOpt.isPresent()) {
            throw new RuntimeException("Service not found");
        }
        com.pet_care_management.pet.entity.Service service = serviceOpt.get();
        // Save review
        ServiceReview review = new ServiceReview();
        review.setUser(user);
        review.setService(service);
        review.setAppointment(appointment);
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    @Override
    public List<ServiceReview> getReviewsByService(Integer serviceId) {
        if (serviceId == null) {
            throw new IllegalArgumentException("ServiceId cannot be null");
        }
        return reviewRepository.findByServiceId(serviceId);
    }

    @Override
    public List<ServiceReview> getReviewsByUser(Integer userId) {
        if (userId == null) {
            throw new IllegalArgumentException("UserId cannot be null");
        }
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public ServiceReviewResponse updateReview(String username, Integer reviewId, Integer rating, String comment) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (reviewId == null || rating == null) {
            throw new IllegalArgumentException("ReviewId and rating cannot be null");
        }
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        Optional<ServiceReview> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            throw new RuntimeException("Review not found");
        }
        ServiceReview review = reviewOpt.get();
        String role = user.getRole().getName();
        if (!review.getUser().getId().equals(user.getId())
            && !(role.equalsIgnoreCase("admin") || role.equalsIgnoreCase("doctor"))) {
            throw new RuntimeException("Bạn không có quyền sửa đánh giá này!");
        }
        review.setRating(rating);
        review.setComment(comment);
        reviewRepository.save(review);
        return new ServiceReviewResponse(review);
    }

    @Override
    public void deleteReview(String username, Integer reviewId, String role) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (reviewId == null || role == null) {
            throw new IllegalArgumentException("ReviewId and role cannot be null");
        }
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        Optional<ServiceReview> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            throw new RuntimeException("Review not found");
        }
        ServiceReview review = reviewOpt.get();
        // Nếu là admin/doctor thì được xóa tất cả, còn lại chỉ xóa review của chính mình
        if (!review.getUser().getId().equals(user.getId())
            && !(role.equalsIgnoreCase("admin") || role.equalsIgnoreCase("doctor"))) {
            throw new RuntimeException("Bạn không có quyền xóa đánh giá này!");
        }
        reviewRepository.delete(review);
    }

    @Override
    public ServiceReview getReviewById(Integer reviewId) {
        if (reviewId == null) {
            throw new IllegalArgumentException("ReviewId cannot be null");
        }
        Optional<ServiceReview> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            throw new RuntimeException("Review not found");
        }
        return reviewOpt.get();
    }
} 