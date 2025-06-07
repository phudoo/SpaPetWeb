package com.pet_care_management.pet.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.pet_care_management.pet.dto.AlbumDTO;
import com.pet_care_management.pet.entity.Album;

public interface AlbumService {
    // Create
    Album uploadImage(AlbumDTO albumDTO, MultipartFile image, String username) throws Exception;
    
    // Read
    Album getImageById(Integer id, String username);
    List<Album> getImagesByUsername(String username);
    List<Album> getAllImages();
    byte[] getImageFile(Integer id);
    
    // Update
    Album updateImage(Integer id, AlbumDTO albumDTO, MultipartFile image, String username) throws Exception;
    
    // Delete
    void deleteImage(Integer id, String username);
} 