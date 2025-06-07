package com.pet_care_management.pet.controller;

import java.util.ArrayList;
import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pet_care_management.pet.dto.PetDTO;
import com.pet_care_management.pet.entity.Pet;
import com.pet_care_management.pet.service.PetService;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService petService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPet(
            @RequestPart(value = "pet", required = true) String petJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            PetDTO petDTO = mapper.readValue(petJson, PetDTO.class);
            Integer ownerId = null;
            boolean isAdminOrDoctor = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("admin") || a.getAuthority().equals("doctor"));
            if (isAdminOrDoctor && petDTO.getOwnerId() != null) {
                ownerId = petDTO.getOwnerId();
            }
            Pet createdPet = petService.createPet(petDTO, image, authentication.getName(), ownerId);
            return ResponseEntity.ok(new PetDTO(createdPet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPet(@PathVariable Integer id, Authentication authentication) {
        try {
            Pet pet = petService.getPetById(id, authentication.getName());
            return ResponseEntity.ok(new PetDTO(pet));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<?> getPetImage(@PathVariable Integer id) {
        try {
            byte[] imageData = petService.getPetImage(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-pets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyPets(Authentication authentication) {
        try {
            List<Pet> pets = petService.getPetsByUsername(authentication.getName());
            List<PetDTO> petDTOs = new ArrayList<>();
            for (Pet pet : pets) {
                petDTOs.add(new PetDTO(pet));
            }
            return ResponseEntity.ok(petDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> getAllPets() {
        try {
            List<Pet> pets = petService.getAllPets();
            List<PetDTO> petDTOs = new ArrayList<>();
            for (Pet pet : pets) {
                petDTOs.add(new PetDTO(pet));
            }
            return ResponseEntity.ok(petDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/species/{species}")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<?> getPetsBySpecies(@PathVariable String species) {
        try {
            List<Pet> pets = petService.getPetsBySpecies(species);
            List<PetDTO> petDTOs = new ArrayList<>();
            for (Pet pet : pets) {
                petDTOs.add(new PetDTO(pet));
            }
            return ResponseEntity.ok(petDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<?> searchPetsByName(@RequestParam String name) {
        try {
            List<Pet> pets = petService.getPetsByName(name);
            List<PetDTO> petDTOs = new ArrayList<>();
            for (Pet pet : pets) {
                petDTOs.add(new PetDTO(pet));
            }
            return ResponseEntity.ok(petDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePet(
            @PathVariable Integer id,
            @RequestPart(value = "pet", required = true) String petJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            PetDTO petDTO = mapper.readValue(petJson, PetDTO.class);
            Integer ownerId = null;
            boolean isAdminOrDoctor = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("admin") || a.getAuthority().equals("doctor"));
            if (isAdminOrDoctor && petDTO.getOwnerId() != null) {
                ownerId = petDTO.getOwnerId();
            }
            Pet updatedPet = petService.updatePet(id, petDTO, image, authentication.getName(), ownerId);
            return ResponseEntity.ok(new PetDTO(updatedPet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePet(@PathVariable Integer id, Authentication authentication) {
        try {
            petService.deletePet(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}