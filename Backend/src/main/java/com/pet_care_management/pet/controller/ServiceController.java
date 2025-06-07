package com.pet_care_management.pet.controller;

import com.pet_care_management.pet.dto.ServiceRequest;
import com.pet_care_management.pet.dto.ServiceResponse;
import com.pet_care_management.pet.entity.Service;
import com.pet_care_management.pet.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.createService(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getService(@PathVariable Integer id) {
        return ResponseEntity.ok(serviceService.getService(id));
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> updateService(@PathVariable Integer id, @RequestBody ServiceRequest request) {
        ServiceResponse updatedService = serviceService.updateService(id, request);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Integer id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok().build();
    }
} 