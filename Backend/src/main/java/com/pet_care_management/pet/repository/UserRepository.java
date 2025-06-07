package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Role;
import com.pet_care_management.pet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByUsernameContainingOrFullNameContainingOrEmailContaining(
            String username, String fullName, String email);
} 