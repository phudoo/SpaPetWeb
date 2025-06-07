package com.pet_care_management.pet.controller;

import com.pet_care_management.pet.dto.AppointmentRequest;
import com.pet_care_management.pet.dto.AppointmentResponse;
import com.pet_care_management.pet.entity.Appointment;
import com.pet_care_management.pet.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // User endpoints
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication) {
        try {
            Appointment appointment = appointmentService.createAppointment(request, authentication.getName());
            return ResponseEntity.ok(new AppointmentResponse(appointment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/my-appointments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(authentication.getName()));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Integer id,
            Authentication authentication) {
        try {
            appointmentService.cancelAppointment(id, authentication.getName());
            return ResponseEntity.ok("Appointment cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/admin/date")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
    }

    @GetMapping("/admin/month")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByMonth(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByMonth(month, year));
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        try {
            Appointment appointment = appointmentService.updateAppointmentStatus(id, status);
            return ResponseEntity.ok(new AppointmentResponse(appointment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Common endpoints
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAppointment(
            @PathVariable Integer id,
            Authentication authentication) {
        try {
            Appointment appointment = appointmentService.getAppointment(id, authentication.getName());
            return ResponseEntity.ok(new AppointmentResponse(appointment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get booked appointments (PENDING and SCHEDULED)
    @GetMapping("/booked")
    public ResponseEntity<List<AppointmentResponse>> getBookedAppointments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(appointmentService.getBookedAppointments(startDate, endDate));
    }
} 