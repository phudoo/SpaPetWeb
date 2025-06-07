package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet, Integer> {
    List<Pet> findByOwnerId(Integer ownerId);
    List<Pet> findBySpecies(String species);
    List<Pet> findByNameContainingIgnoreCase(String name);
    List<Pet> findByOwnerIdAndIsDeletedFalse(Integer ownerId);
    List<Pet> findBySpeciesAndIsDeletedFalse(String species);
    List<Pet> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name);
    List<Pet> findAllByIsDeletedFalse();
    Optional<Pet> findByIdAndIsDeletedFalse(Integer id);
} 