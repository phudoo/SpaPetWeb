package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Integer> {
    Optional<Service> findByIdAndIsDeletedFalse(Integer id);
    List<Service> findAllByIsDeletedFalse();
} 