package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findAllByOrderByCreatedAtDesc();
} 