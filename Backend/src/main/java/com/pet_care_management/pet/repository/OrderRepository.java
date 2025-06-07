package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(Integer userId);
    List<Order> findByStatus(String status);
} 