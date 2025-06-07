package com.pet_care_management.pet.service;

import com.pet_care_management.pet.dto.LoginRequest;
import com.pet_care_management.pet.dto.RegisterRequest;
import com.pet_care_management.pet.dto.UserResponse;
import com.pet_care_management.pet.entity.User;
import java.util.List;
 
public interface UserService {
    User register(RegisterRequest request);
    User login(LoginRequest request);
    User findByUsername(String username);
    User updateUser(Integer id, RegisterRequest request);
    
    // Admin-specific methods
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Integer id);
    void updateUserStatus(Integer id, Boolean isActive);
    void deleteUser(Integer id);
    List<UserResponse> searchUsers(String keyword);
    List<UserResponse> getUsersByRole(String roleName);
    List<Integer> getAllUserIds();
} 