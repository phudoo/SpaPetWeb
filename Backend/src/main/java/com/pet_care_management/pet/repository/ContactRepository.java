package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {
} 