package com.pet_care_management.pet.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pet_care_management.pet.dto.LoginRequest;
import com.pet_care_management.pet.dto.RegisterRequest;
import com.pet_care_management.pet.dto.UserResponse;
import com.pet_care_management.pet.entity.Role;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.RoleRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("RegisterRequest cannot be null");
        }
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        // Get role
        Optional<Role> roleOpt = roleRepository.findById(request.getRoleId());
        if (!roleOpt.isPresent()) {
            throw new RuntimeException("Role not found");
        }
        Role role = roleOpt.get();
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(role);
        user.setIsActive(true);
        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("LoginRequest cannot be null");
        }
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        if (!user.getIsActive()) {
            throw new RuntimeException("User is inactive");
        }
        return user;
    }

    @Override
    public User findByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        return userOpt.get();
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> responses = new ArrayList<>();
        for (User user : users) {
            responses.add(new UserResponse(user));
        }
        return responses;
    }

    @Override
    public List<Integer> getAllUserIds() {
        List<User> users = userRepository.findAll();
        List<Integer> ids = new ArrayList<>();
        for (User user : users) {
            ids.add(user.getId());
        }
        return ids;
    }

    @Override
    public UserResponse getUserById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("User id cannot be null");
        }
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with id: " + id);
        }
        return new UserResponse(userOpt.get());
    }

    @Override
    @Transactional
    public void updateUserStatus(Integer id, Boolean isActive) {
        if (id == null) {
            throw new IllegalArgumentException("User id cannot be null");
        }
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with id: " + id);
        }
        User user = userOpt.get();
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("User id cannot be null");
        }
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<UserResponse> searchUsers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException("Keyword cannot be null or empty");
        }
        List<User> users = userRepository.findByUsernameContainingOrFullNameContainingOrEmailContaining(
                keyword, keyword, keyword);
        List<UserResponse> responses = new ArrayList<>();
        for (User user : users) {
            responses.add(new UserResponse(user));
        }
        return responses;
    }

    @Override
    public List<UserResponse> getUsersByRole(String roleName) {
        if (roleName == null || roleName.trim().isEmpty()) {
            throw new IllegalArgumentException("Role name cannot be null or empty");
        }
        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        if (!roleOpt.isPresent()) {
            throw new RuntimeException("Role not found");
        }
        Role role = roleOpt.get();
        List<User> users = userRepository.findByRole(role);
        List<UserResponse> responses = new ArrayList<>();
        for (User user : users) {
            responses.add(new UserResponse(user));
        }
        return responses;
    }

    @Override
    @Transactional
    public User updateUser(Integer id, RegisterRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("User id cannot be null");
        }
        if (request == null) {
            throw new IllegalArgumentException("RegisterRequest cannot be null");
        }
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with id: " + id);
        }
        User user = userOpt.get();
        // Check if new username is different and already exists
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        // Check if new email is different and already exists
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        // Get role if roleId is provided
        if (request.getRoleId() != null) {
            Optional<Role> roleOpt = roleRepository.findById(request.getRoleId());
            if (!roleOpt.isPresent()) {
                throw new RuntimeException("Role not found");
            }
            user.setRole(roleOpt.get());
        }
        // Update user fields
        user.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        return userRepository.save(user);
    }
} 