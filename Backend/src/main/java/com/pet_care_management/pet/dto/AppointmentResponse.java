package com.pet_care_management.pet.dto;

import com.pet_care_management.pet.entity.Appointment;
import com.pet_care_management.pet.entity.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class AppointmentResponse {
    private Integer id;
    private String petName;
    private String petOwnerName;
    private LocalDateTime appointmentDate;
    private String note;
    private String status;
    private Set<String> services;

    public AppointmentResponse(Appointment appointment) {
        this.id = appointment.getId();
        this.petName = appointment.getPet().getName();
        this.petOwnerName = appointment.getPet().getOwner().getFullName();
        this.appointmentDate = appointment.getAppointmentDate();
        this.note = appointment.getNote();
        this.status = appointment.getStatus();
        this.services = appointment.getServices().stream()
                .map(Service::getName)
                .collect(Collectors.toSet());
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getPetOwnerName() {
        return petOwnerName;
    }

    public void setPetOwnerName(String petOwnerName) {
        this.petOwnerName = petOwnerName;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<String> getServices() {
        return services;
    }

    public void setServices(Set<String> services) {
        this.services = services;
    }

    // DTO cho thống kê doanh thu chi tiết từng lịch hoàn thành
    public static class CompletedAppointmentRevenueDTO {
        private Integer appointmentId;
        private String appointmentDate;
        private String petName;
        private String ownerName;
        private java.util.List<ServiceInfo> services;
        private Integer appointmentRevenue;

        public CompletedAppointmentRevenueDTO(Integer appointmentId, String appointmentDate, String petName, String ownerName, java.util.List<ServiceInfo> services, Integer appointmentRevenue) {
            this.appointmentId = appointmentId;
            this.appointmentDate = appointmentDate;
            this.petName = petName;
            this.ownerName = ownerName;
            this.services = services;
            this.appointmentRevenue = appointmentRevenue;
        }

        public Integer getAppointmentId() { return appointmentId; }
        public String getAppointmentDate() { return appointmentDate; }
        public String getPetName() { return petName; }
        public String getOwnerName() { return ownerName; }
        public java.util.List<ServiceInfo> getServices() { return services; }
        public Integer getAppointmentRevenue() { return appointmentRevenue; }

        public static class ServiceInfo {
            private String serviceName;
            private Integer price;
            public ServiceInfo(String serviceName, Integer price) {
                this.serviceName = serviceName;
                this.price = price;
            }
            public String getServiceName() { return serviceName; }
            public Integer getPrice() { return price; }
        }
    }
} 