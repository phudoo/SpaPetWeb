package com.pet_care_management.pet.controller;

import com.pet_care_management.pet.service.AppointmentService;
import com.pet_care_management.pet.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private OrderService orderService;

    // Revenue statistics endpoints
    @GetMapping("/revenue")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<Map<String, Object>> getRevenueStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(appointmentService.getRevenueStatistics(startDate, endDate));
    }

    @GetMapping("/revenue/detailed")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<Map<String, Object>>> getDetailedRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(appointmentService.getDetailedRevenueReport(startDate, endDate));
    }

    // Monthly revenue statistics
    @GetMapping("/revenue/monthly")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<Map<String, Object>> getMonthlyRevenueStatistics(
            @RequestParam int year,
            @RequestParam int month) {
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusSeconds(1);
        return ResponseEntity.ok(appointmentService.getRevenueStatistics(startDate, endDate));
    }

    // Yearly revenue statistics
    @GetMapping("/revenue/yearly")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<Map<String, Object>> getYearlyRevenueStatistics(
            @RequestParam int year) {
        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endDate = startDate.plusYears(1).minusSeconds(1);
        return ResponseEntity.ok(appointmentService.getRevenueStatistics(startDate, endDate));
    }

    // Product revenue statistics
    @GetMapping("/products/revenue")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<Map<String, Object>> getProductRevenueStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(orderService.getProductRevenueStatistics(startDate, endDate));
    }

    @GetMapping("/products/revenue/detailed")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<Map<String, Object>>> getDetailedProductRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(orderService.getDetailedProductRevenueReport(startDate, endDate));
    }

    @GetMapping("/products/revenue/monthly")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<Map<String, Object>> getMonthlyProductRevenueStatistics(
            @RequestParam int year,
            @RequestParam int month) {
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusSeconds(1);
        return ResponseEntity.ok(orderService.getProductRevenueStatistics(startDate, endDate));
    }

    @GetMapping("/products/revenue/yearly")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<Map<String, Object>> getYearlyProductRevenueStatistics(
            @RequestParam int year) {
        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endDate = startDate.plusYears(1).minusSeconds(1);
        return ResponseEntity.ok(orderService.getProductRevenueStatistics(startDate, endDate));
    }
} 