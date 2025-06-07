package com.pet_care_management.pet.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pet_care_management.pet.dto.AppointmentRequest;
import com.pet_care_management.pet.dto.AppointmentResponse;
import com.pet_care_management.pet.dto.AppointmentResponse.CompletedAppointmentRevenueDTO;
import com.pet_care_management.pet.entity.Appointment;
import com.pet_care_management.pet.entity.Pet;
import com.pet_care_management.pet.entity.Service;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.AppointmentRepository;
import com.pet_care_management.pet.repository.PetRepository;
import com.pet_care_management.pet.repository.ServiceRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.AppointmentService;

@org.springframework.stereotype.Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    @Transactional
    public Appointment createAppointment(AppointmentRequest request, String username) {
        // Validate: Ngày giờ đặt lịch phải ở tương lai
        if (request.getAppointmentDate() == null || request.getAppointmentDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Appointment date must be in the future");
        }
        // Validate: Phải chọn ít nhất một dịch vụ
        if (request.getServiceIds() == null || request.getServiceIds().isEmpty()) {
            throw new RuntimeException("At least one service must be selected");
        }

        // Get user
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Get pet and verify ownership
        Optional<Pet> petOpt = petRepository.findById(request.getPetId());
        if (!petOpt.isPresent()) {
            throw new RuntimeException("Pet not found");
        }
        Pet pet = petOpt.get();
        
        // Allow admin to create appointment for any pet
        if (!"admin".equals(user.getRole().getName()) && !pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to create appointment for this pet");
        }

        // Validate: Không cho phép đặt lịch trùng giờ cho pet với status PENDING/SCHEDULED/COMPLETED
        List<Appointment> existing = appointmentRepository.findByPetId(pet.getId());
        for (Appointment a : existing) {
            if (a.getAppointmentDate().equals(request.getAppointmentDate()) &&
                ("PENDING".equals(a.getStatus()) || "SCHEDULED".equals(a.getStatus()))) {
                throw new RuntimeException("This pet already has an appointment at this time");
            }
        }

        // Get services
        Set<Service> services = new HashSet<>();
        for (Integer serviceId : request.getServiceIds()) {
            Optional<Service> serviceOpt = serviceRepository.findById(serviceId);
            if (!serviceOpt.isPresent()) {
                throw new RuntimeException("Service not found: " + serviceId);
            }
            services.add(serviceOpt.get());
        }

        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setPet(pet);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setNote(request.getNote());
        appointment.setServices(services);
        appointment.setStatus("PENDING");

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByUser(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        
        List<Appointment> appointments = appointmentRepository.findByPetOwnerId(user.getId());
        List<AppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            responses.add(new AppointmentResponse(appointment));
        }
        return responses;
    }

    @Override
    @Transactional
    public void cancelAppointment(Integer id, String username) {
        Appointment appointment = getAppointment(id, username);
        
        if (!"SCHEDULED".equals(appointment.getStatus()) && !"PENDING".equals(appointment.getStatus())) {
            throw new RuntimeException("Can only cancel pending or scheduled appointments");
        }
        
        appointment.setStatus("CANCELED");
        appointmentRepository.save(appointment);
    }

    @Override
    public Appointment getAppointment(Integer id, String username) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (!appointmentOpt.isPresent()) {
            throw new RuntimeException("Appointment not found");
        }
        Appointment appointment = appointmentOpt.get();
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        
        // Check if user has permission to view this appointment
        if (!appointment.getPet().getOwner().getId().equals(user.getId()) &&
            !"admin".equals(user.getRole().getName()) &&
            !"doctor".equals(user.getRole().getName())) {
            throw new RuntimeException("You don't have permission to view this appointment");
        }
        
        return appointment;
    }

    @Override
    public List<AppointmentResponse> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        List<AppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            responses.add(new AppointmentResponse(appointment));
        }
        return responses;
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByDate(LocalDateTime date) {
        List<Appointment> appointments = appointmentRepository.findByDate(date);
        List<AppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            responses.add(new AppointmentResponse(appointment));
        }
        return responses;
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByMonth(int month, int year) {
        List<Appointment> appointments = appointmentRepository.findByMonthAndYear(month, year);
        List<AppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            responses.add(new AppointmentResponse(appointment));
        }
        return responses;
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByStatus(String status) {
        List<Appointment> appointments = appointmentRepository.findByStatus(status);
        List<AppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            responses.add(new AppointmentResponse(appointment));
        }
        return responses;
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByPet(Integer petId) {
        List<Appointment> appointments = appointmentRepository.findByPetId(petId);
        List<AppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            responses.add(new AppointmentResponse(appointment));
        }
        return responses;
    }

    @Override
    @Transactional
    public Appointment updateAppointmentStatus(Integer id, String status) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (!appointmentOpt.isPresent()) {
            throw new RuntimeException("Appointment not found");
        }
        Appointment appointment = appointmentOpt.get();
        
        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid appointment status: " + status);
        }
        
        if (!isValidStatusTransition(appointment.getStatus(), status)) {
            throw new RuntimeException("Invalid status transition from " + appointment.getStatus() + " to " + status);
        }
        
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    private boolean isValidStatus(String status) {
        return status != null && (
            status.equals("PENDING") ||
            status.equals("SCHEDULED") ||
            status.equals("COMPLETED") ||
            status.equals("CANCELED")
        );
    }

    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        if ("PENDING".equals(currentStatus) && "SCHEDULED".equals(newStatus)) return true;
        if ("SCHEDULED".equals(currentStatus) && "COMPLETED".equals(newStatus)) return true;
        if (!"COMPLETED".equals(currentStatus) && "CANCELED".equals(newStatus)) return true;
        return false;
    }

    @Override
    public List<AppointmentResponse> getBookedAppointments(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByDateRange(startDate, endDate);
        List<AppointmentResponse> responses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            responses.add(new AppointmentResponse(appointment));
        }
        return responses;
    }

    @Override
    public Map<String, Object> getRevenueStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> completedAppointments = appointmentRepository.findCompletedAppointmentsWithRevenue(startDate, endDate);
        int totalRevenue = 0;
        List<CompletedAppointmentRevenueDTO> appointmentDetails = new ArrayList<>();
        
        for (Appointment appointment : completedAppointments) {
            int appointmentRevenue = 0;
            List<CompletedAppointmentRevenueDTO.ServiceInfo> services = new ArrayList<>();
            
            for (Service service : appointment.getServices()) {
                services.add(new CompletedAppointmentRevenueDTO.ServiceInfo(service.getName(), service.getPrice()));
                appointmentRevenue += service.getPrice();
            }
            
            totalRevenue += appointmentRevenue;
            appointmentDetails.add(new CompletedAppointmentRevenueDTO(
                appointment.getId(),
                appointment.getAppointmentDate() != null ? appointment.getAppointmentDate().toString() : null,
                appointment.getPet() != null ? appointment.getPet().getName() : null,
                (appointment.getPet() != null && appointment.getPet().getOwner() != null) ? 
                    appointment.getPet().getOwner().getFullName() : null,
                services,
                appointmentRevenue
            ));
        }
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalRevenue", totalRevenue);
        statistics.put("totalCompletedAppointments", completedAppointments.size());
        statistics.put("appointments", appointmentDetails);
        statistics.put("startDate", startDate);
        statistics.put("endDate", endDate);
        return statistics;
    }

    @Override
    public List<Map<String, Object>> getDetailedRevenueReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> completedAppointments = appointmentRepository.findCompletedAppointmentsWithRevenue(startDate, endDate);
        List<Map<String, Object>> reports = new ArrayList<>();
        
        for (Appointment appointment : completedAppointments) {
            Map<String, Object> report = new HashMap<>();
            report.put("appointmentId", appointment.getId());
            report.put("appointmentDate", appointment.getAppointmentDate());
            report.put("petName", appointment.getPet().getName());
            report.put("ownerName", appointment.getPet().getOwner().getFullName());
            
            // Calculate total revenue for this appointment
            int appointmentRevenue = 0;
            List<Map<String, Object>> services = new ArrayList<>();
            
            for (Service service : appointment.getServices()) {
                Map<String, Object> serviceInfo = new HashMap<>();
                serviceInfo.put("serviceName", service.getName());
                serviceInfo.put("price", service.getPrice());
                services.add(serviceInfo);
                appointmentRevenue += service.getPrice();
            }
            
            report.put("revenue", appointmentRevenue);
            report.put("services", services);
            reports.add(report);
        }
        
        return reports;
    }
} 