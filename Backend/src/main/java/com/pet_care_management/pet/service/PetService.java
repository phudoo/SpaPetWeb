package com.pet_care_management.pet.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.pet_care_management.pet.dto.PetDTO;
import com.pet_care_management.pet.entity.Pet;

public interface PetService {
    // Create
    Pet createPet(PetDTO petDTO, MultipartFile image, String username, Integer ownerId) throws Exception;
    
    // Read
    Pet getPetById(Integer id, String username);
    List<Pet> getPetsByUsername(String username);
    List<Pet> getAllPets();
    List<Pet> getPetsBySpecies(String species);
    List<Pet> getPetsByName(String name);
    byte[] getPetImage(Integer id);
    
    // Update
    Pet updatePet(Integer id, PetDTO petDTO, MultipartFile image, String username, Integer ownerId) throws Exception;
    
    // Delete
    void deletePet(Integer id, String username);
} 