package com.pet_care_management.pet.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class AppointmentRequest {
    private Integer petId;
    private LocalDateTime appointmentDate;
    private String note;
    private Set<Integer> serviceIds;

    public Integer getPetId() {
        return petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
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

    public Set<Integer> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(Set<Integer> serviceIds) {
        this.serviceIds = serviceIds;
    }
} 