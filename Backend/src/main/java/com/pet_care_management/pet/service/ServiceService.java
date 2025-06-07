package com.pet_care_management.pet.service;

import com.pet_care_management.pet.dto.ServiceRequest;
import com.pet_care_management.pet.dto.ServiceResponse;
import com.pet_care_management.pet.entity.Service;
import java.util.List;

public interface ServiceService {
    Service createService(ServiceRequest request);
    Service getService(Integer id);
    List<ServiceResponse> getAllServices();
    ServiceResponse updateService(Integer id, ServiceRequest request);
    void deleteService(Integer id);
} 