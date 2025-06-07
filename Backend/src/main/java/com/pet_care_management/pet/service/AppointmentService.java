package com.pet_care_management.pet.service;

import com.pet_care_management.pet.dto.AppointmentRequest;
import com.pet_care_management.pet.dto.AppointmentResponse;
import com.pet_care_management.pet.entity.Appointment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AppointmentService {
    // User operations
    Appointment createAppointment(AppointmentRequest request, String username);
    List<AppointmentResponse> getAppointmentsByUser(String username);
    void cancelAppointment(Integer id, String username);
    
    // Admin operations
    List<AppointmentResponse> getAllAppointments();
    List<AppointmentResponse> getAppointmentsByDate(LocalDateTime date);
    List<AppointmentResponse> getAppointmentsByMonth(int month, int year);
    List<AppointmentResponse> getAppointmentsByStatus(String status);
    
    // Common operations
    Appointment getAppointment(Integer id, String username);
    List<AppointmentResponse> getAppointmentsByPet(Integer petId);
    
    // Update appointment status
    Appointment updateAppointmentStatus(Integer id, String status);

    // Get available appointments
    List<AppointmentResponse> getBookedAppointments(LocalDateTime startDate, LocalDateTime endDate);

    // Revenue statistics
    Map<String, Object> getRevenueStatistics(LocalDateTime startDate, LocalDateTime endDate);
    List<Map<String, Object>> getDetailedRevenueReport(LocalDateTime startDate, LocalDateTime endDate);
} 