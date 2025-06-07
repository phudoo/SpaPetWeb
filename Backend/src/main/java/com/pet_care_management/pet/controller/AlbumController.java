package com.pet_care_management.pet.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pet_care_management.pet.dto.AlbumDTO;
import com.pet_care_management.pet.entity.Album;
import com.pet_care_management.pet.service.AlbumService;

@RestController
@RequestMapping("/api/albums")
@CrossOrigin(origins = "*")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    private AlbumDTO convertToDTO(Album album) {
        AlbumDTO dto = new AlbumDTO();
        dto.setId(album.getId());
        dto.setFilePath(album.getFilePath());
        dto.setDescription(album.getDescription());
        dto.setUserName(album.getUser().getFullName());
        dto.setUserId(album.getUser().getId());
        dto.setCreatedAt(album.getCreatedAt());
        dto.setUpdatedAt(album.getUpdatedAt());
        return dto;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadImage(
            @RequestPart(value = "album", required = true) String albumJson,
            @RequestPart(value = "image", required = true) MultipartFile image,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            AlbumDTO albumDTO = mapper.readValue(albumJson, AlbumDTO.class);
            Album createdAlbum = albumService.uploadImage(albumDTO, image, authentication.getName());
            return ResponseEntity.ok(convertToDTO(createdAlbum));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getImage(@PathVariable Integer id, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : null;
            Album album = albumService.getImageById(id, username);
            return ResponseEntity.ok(convertToDTO(album));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<?> getImageFile(@PathVariable Integer id) {
        try {
            byte[] imageData = albumService.getImageFile(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-images")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyImages(Authentication authentication) {
        try {
            List<Album> albums = albumService.getImagesByUsername(authentication.getName());
            List<AlbumDTO> albumDTOs = albums.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(albumDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllImages() {
        try {
            List<Album> albums = albumService.getAllImages();
            List<AlbumDTO> albumDTOs = albums.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(albumDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateImage(
            @PathVariable Integer id,
            @RequestPart(value = "album", required = true) String albumJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            AlbumDTO albumDTO = mapper.readValue(albumJson, AlbumDTO.class);
            Album updatedAlbum = albumService.updateImage(id, albumDTO, image, authentication.getName());
            return ResponseEntity.ok(convertToDTO(updatedAlbum));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteImage(@PathVariable Integer id, Authentication authentication) {
        try {
            albumService.deleteImage(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/gallery")
    public ResponseEntity<String> getGalleryPage() {
        try {
            List<Album> albums = albumService.getAllImages();
            StringBuilder html = new StringBuilder();
            
            html.append("<!DOCTYPE html>")
                .append("<html>")
                .append("<head>")
                .append("<title>Pet Care Gallery</title>")
                .append("</head>")
                .append("<body>");

            // Add each image directly
            for (Album album : albums) {
                html.append("<img src='/api/albums/image/")
                    .append(album.getId())
                    .append("' style='width: 300px; margin: 10px;'>");
            }

            html.append("</body>")
                .append("</html>");

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(html.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
} 