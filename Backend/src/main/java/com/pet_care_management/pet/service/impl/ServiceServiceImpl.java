package com.pet_care_management.pet.service.impl;

import com.pet_care_management.pet.dto.ServiceRequest;
import com.pet_care_management.pet.dto.ServiceResponse;
import com.pet_care_management.pet.entity.Service;
import com.pet_care_management.pet.repository.ServiceRepository;
import com.pet_care_management.pet.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    @Transactional
    public Service createService(ServiceRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("ServiceRequest cannot be null");
        }
        // Create new service
        Service service = new Service();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        return serviceRepository.save(service);
    }

    @Override
    public Service getService(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Service id cannot be null");
        }
        Optional<Service> serviceOpt = serviceRepository.findByIdAndIsDeletedFalse(id);
        if (!serviceOpt.isPresent()) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        return serviceOpt.get();
    }

    @Override
    public List<ServiceResponse> getAllServices() {
        List<Service> services = serviceRepository.findAllByIsDeletedFalse();
        List<ServiceResponse> responses = new ArrayList<>();
        for (Service service : services) {
            responses.add(new ServiceResponse(service));
        }
        return responses;
    }

    @Override
    @Transactional
    public ServiceResponse updateService(Integer id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setUpdatedAt(LocalDateTime.now());

        Service updatedService = serviceRepository.save(service);
        return new ServiceResponse(updatedService);
    }

    @Override
    @Transactional
    public void deleteService(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Service id cannot be null");
        }
        Service service = getService(id);
        // Soft delete: set isDeleted = true
        service.setIsDeleted(true);
        serviceRepository.save(service);
    }
} 