package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
 
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(String name);
} 