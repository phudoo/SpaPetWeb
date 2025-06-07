package com.pet_care_management.pet.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pet_care_management.pet.entity.Pet;

public class PetDTO {
    private Integer id;
    private String name;
    private String species;
    private String breed;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
    
    private String sex;
    private String imagePath;
    private String ownerName;
    private Integer ownerId;

    // Constructor
    public PetDTO() {}

    public PetDTO(Pet pet) {
        this.id = pet.getId();
        this.name = pet.getName();
        this.species = pet.getSpecies();
        this.breed = pet.getBreed();
        this.birthday = pet.getBirthday();
        this.sex = pet.getSex();
        this.imagePath = pet.getImagePath();
        this.ownerName = pet.getOwner() != null ? pet.getOwner().getFullName() : null;
        this.ownerId = pet.getOwner() != null ? pet.getOwner().getId() : null;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public Integer getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }
} 