package com.pet_care_management.pet.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.pet_care_management.pet.dto.AlbumDTO;
import com.pet_care_management.pet.entity.Album;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.AlbumRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.AlbumService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AlbumServiceImpl implements AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir.albums}")
    private String uploadDir;

    @Override
    @Transactional
    public Album uploadImage(AlbumDTO albumDTO, MultipartFile image, String username) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Image is required");
        }

        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        // Generate filename
        String originalFilename = StringUtils.cleanPath(image.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = "album_" + System.currentTimeMillis() + fileExtension;

        // Copy file to target location
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Create and save album with file path
        Album album = new Album();
        album.setDescription(albumDTO.getDescription());
        album.setUser(user);
        album.setFilePath(fileName);
        
        return albumRepository.save(album);
    }

    @Override
    @Transactional
    public Album updateImage(Integer id, AlbumDTO albumDTO, MultipartFile image, String username) throws Exception {
        Album existingAlbum = getImageById(id, username);
        existingAlbum.setDescription(albumDTO.getDescription());

        if (image != null && !image.isEmpty()) {
            if (existingAlbum.getFilePath() != null) {
                deleteFile(existingAlbum.getFilePath());
            }
            String fileName = storeFile(image, existingAlbum.getId());
            existingAlbum.setFilePath(fileName);
        }

        return albumRepository.save(existingAlbum);
    }

    @Override
    @Transactional
    public void deleteImage(Integer id, String username) {
        Album album = getImageById(id, username);
        
        // Verify ownership
        if (!album.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this image");
        }

        // Delete associated image if exists
        if (album.getFilePath() != null) {
            deleteFile(album.getFilePath());
        }
        
        albumRepository.delete(album);
    }

    @Override
    public Album getImageById(Integer id, String username) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Image not found with id: " + id));
        if (username != null) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            boolean isOwner = album.getUser().getUsername().equals(username);
            boolean isDoctor = user.getRole().getName().equalsIgnoreCase("doctor");
            boolean isAdmin = user.getRole().getName().equalsIgnoreCase("admin");
            if (!(isOwner || isDoctor || isAdmin)) {
                throw new RuntimeException("You don't have permission to view this image");
            }
        }
        return album;
    }

    @Override
    public List<Album> getAllImages() {
        return albumRepository.findAll();
    }

    @Override
    public List<Album> getImagesByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return albumRepository.findByUserId(user.getId());
    }

    @Override
    public byte[] getImageFile(Integer id) {
        try {
            Album album = getImageById(id, null); // We don't need username check for image retrieval
            if (album.getFilePath() == null) {
                throw new RuntimeException("No image found with id: " + id);
            }
            Path filePath = Paths.get(uploadDir).resolve(album.getFilePath());
            if (!Files.exists(filePath)) {
                throw new RuntimeException("Image file not found with id: " + id);
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Error reading image file: " + e.getMessage(), e);
        }
    }

    private String storeFile(MultipartFile file, Integer id) throws IOException {
        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        // Generate filename based on album id
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = "album_" + id + fileExtension;

        // Copy file to target location
        Path targetLocation = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return newFilename;
    }

    private void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + fileName, e);
        }
    }
} 