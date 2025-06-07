package com.pet_care_management.pet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pet_care_management.pet.entity.Album;

public interface AlbumRepository extends JpaRepository<Album, Integer> {
    List<Album> findByUserId(Integer userId);
} 