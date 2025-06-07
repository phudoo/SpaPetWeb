package com.pet_care_management.pet.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.pet_care_management.pet.entity.Pet;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.PetRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.repository.AppointmentRepository;
import com.pet_care_management.pet.service.PetService;
import com.pet_care_management.pet.dto.PetDTO;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Value("${file.upload-dir.pets}")
    private String uploadDir;

    @Override
    @Transactional
    public Pet createPet(PetDTO petDTO, MultipartFile image, String username, Integer ownerId) throws Exception {
        if (petDTO == null) {
            throw new IllegalArgumentException("PetDTO cannot be null");
        }
        // Get owner
        User owner;
        if (ownerId != null) {
            Optional<User> ownerOpt = userRepository.findById(ownerId);
            if (!ownerOpt.isPresent()) {
                throw new RuntimeException("Owner not found");
            }
            owner = ownerOpt.get();
        } else {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                throw new RuntimeException("User not found");
            }
            owner = userOpt.get();
        }
        // Create pet
        Pet pet = new Pet();
        pet.setName(petDTO.getName());
        pet.setSpecies(petDTO.getSpecies());
        pet.setBreed(petDTO.getBreed());
        pet.setBirthday(petDTO.getBirthday());
        pet.setSex(petDTO.getSex());
        pet.setOwner(owner);
        Pet savedPet = petRepository.save(pet);
        // Handle image
        if (image != null && !image.isEmpty()) {
            String fileName = storeFile(image, savedPet.getId());
            savedPet.setImagePath(fileName);
            return petRepository.save(savedPet);
        }
        return savedPet;
    }

    @Override
    @Transactional
    public Pet updatePet(Integer id, PetDTO petDTO, MultipartFile image, String username, Integer ownerId) throws Exception {
        if (petDTO == null) {
            throw new IllegalArgumentException("PetDTO cannot be null");
        }
        // Get existing pet
        Pet existingPet = getPetById(id, username);
        // Update owner if needed
        if (ownerId != null) {
            Optional<User> ownerOpt = userRepository.findById(ownerId);
            if (!ownerOpt.isPresent()) {
                throw new RuntimeException("Owner not found");
            }
            User newOwner = ownerOpt.get();
            existingPet.setOwner(newOwner);
        }
        // Update pet info
        existingPet.setName(petDTO.getName());
        existingPet.setSpecies(petDTO.getSpecies());
        existingPet.setBreed(petDTO.getBreed());
        existingPet.setBirthday(petDTO.getBirthday());
        existingPet.setSex(petDTO.getSex());
        // Handle image
        if (image != null && !image.isEmpty()) {
            if (existingPet.getImagePath() != null) {
                deleteFile(existingPet.getImagePath());
            }
            String fileName = storeFile(image, existingPet.getId());
            existingPet.setImagePath(fileName);
        }
        return petRepository.save(existingPet);
    }

    @Override
    @Transactional
    public void deletePet(Integer id, String username) {
        Pet pet = getPetById(id, username);
        // Verify ownership
        if (!pet.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this pet");
        }
        // Check if pet is used in any appointment with status PENDING, SCHEDULED, COMPLETED
        List<String> activeStatuses = new java.util.ArrayList<>();
        activeStatuses.add("PENDING");
        activeStatuses.add("SCHEDULED");
        activeStatuses.add("COMPLETED");
        boolean hasActiveAppointments = appointmentRepository.existsByPetIdAndStatusIn(id, activeStatuses);
        if (hasActiveAppointments) {
            throw new RuntimeException("Cannot delete pet: This pet is used in active appointments (pending, scheduled, or completed). Please cancel those appointments first.");
        }
        // Soft delete: set isDeleted = true
        pet.setIsDeleted(true);
        petRepository.save(pet);
    }

    @Override
    public Pet getPetById(Integer id, String username) {
        Optional<Pet> petOpt = petRepository.findByIdAndIsDeletedFalse(id);
        if (!petOpt.isPresent()) {
            throw new EntityNotFoundException("Pet not found with id: " + id);
        }
        Pet pet = petOpt.get();
        if (username != null) {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                throw new RuntimeException("User not found");
            }
            User user = userOpt.get();
            boolean isOwner = pet.getOwner().getUsername().equals(username);
            boolean isDoctor = user.getRole().getName().equalsIgnoreCase("doctor");
            boolean isAdmin = user.getRole().getName().equalsIgnoreCase("admin");
            if (!(isOwner || isDoctor || isAdmin)) {
                throw new RuntimeException("You don't have permission to view this pet");
            }
        }
        return pet;
    }

    @Override
    public List<Pet> getAllPets() {
        return petRepository.findAllByIsDeletedFalse();
    }

    @Override
    public List<Pet> getPetsBySpecies(String species) {
        if (species == null || species.trim().isEmpty()) {
            throw new IllegalArgumentException("Species cannot be null or empty");
        }
        return petRepository.findBySpeciesAndIsDeletedFalse(species);
    }

    @Override
    public List<Pet> getPetsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        return petRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(name);
    }

    @Override
    public List<Pet> getPetsByUsername(String username) {
        Optional<User> ownerOpt = userRepository.findByUsername(username);
        if (!ownerOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User owner = ownerOpt.get();
        return petRepository.findByOwnerIdAndIsDeletedFalse(owner.getId());
    }

    @Override
    public byte[] getPetImage(Integer id) {
        try {
            Pet pet = getPetById(id, null); // We don't need username check for image retrieval
            if (pet.getImagePath() == null) {
                throw new RuntimeException("No image found for pet with id: " + id);
            }
            Path filePath = Paths.get(uploadDir).resolve(pet.getImagePath());
            if (!Files.exists(filePath)) {
                throw new RuntimeException("Image file not found for pet with id: " + id);
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

        // Generate filename based on pet id
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = "pet_" + id + fileExtension;

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