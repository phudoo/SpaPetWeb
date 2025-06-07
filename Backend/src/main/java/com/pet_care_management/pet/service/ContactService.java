package com.pet_care_management.pet.service;

import com.pet_care_management.pet.dto.ContactRequest;
import com.pet_care_management.pet.dto.ContactResponse;
import java.util.List;

public interface ContactService {
    ContactResponse createContact(ContactRequest request);
    ContactResponse getContactById(Integer id);
    List<ContactResponse> getAllContacts();
    ContactResponse updateContactStatus(Integer id, String status);
    void deleteContact(Integer id);
} 