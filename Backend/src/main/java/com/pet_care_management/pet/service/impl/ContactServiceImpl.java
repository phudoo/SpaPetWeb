package com.pet_care_management.pet.service.impl;

import com.pet_care_management.pet.dto.ContactRequest;
import com.pet_care_management.pet.dto.ContactResponse;
import com.pet_care_management.pet.entity.Contact;
import com.pet_care_management.pet.repository.ContactRepository;
import com.pet_care_management.pet.service.ContactService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public ContactResponse createContact(ContactRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Contact request cannot be null");
        }

        // Create new contact
        Contact contact = new Contact();
        contact.setFullName(request.getFullName());
        contact.setPhone(request.getPhone());
        contact.setAddress(request.getAddress());
        contact.setEmail(request.getEmail());
        contact.setSubject(request.getSubject());
        contact.setContent(request.getContent());
        contact.setStatus("PENDING");

        // Save and convert to response
        Contact savedContact = contactRepository.save(contact);
        return convertToResponse(savedContact);
    }

    @Override
    public ContactResponse getContactById(Integer id) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (!contactOpt.isPresent()) {
            throw new EntityNotFoundException("Contact not found with id: " + id);
        }
        return convertToResponse(contactOpt.get());
    }

    @Override
    public List<ContactResponse> getAllContacts() {
        List<Contact> contacts = contactRepository.findAll();
        List<ContactResponse> responses = new ArrayList<>();
        for (Contact contact : contacts) {
            responses.add(convertToResponse(contact));
        }
        return responses;
    }

    @Override
    public ContactResponse updateContactStatus(Integer id, String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }

        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (!contactOpt.isPresent()) {
            throw new EntityNotFoundException("Contact not found with id: " + id);
        }

        Contact contact = contactOpt.get();
        contact.setStatus(status);
        Contact updatedContact = contactRepository.save(contact);
        return convertToResponse(updatedContact);
    }

    @Override
    public void deleteContact(Integer id) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (!contactOpt.isPresent()) {
            throw new EntityNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    private ContactResponse convertToResponse(Contact contact) {
        if (contact == null) {
            throw new IllegalArgumentException("Contact cannot be null");
        }

        ContactResponse response = new ContactResponse();
        response.setId(contact.getId());
        response.setFullName(contact.getFullName());
        response.setPhone(contact.getPhone());
        response.setAddress(contact.getAddress());
        response.setEmail(contact.getEmail());
        response.setSubject(contact.getSubject());
        response.setContent(contact.getContent());
        response.setStatus(contact.getStatus());
        response.setCreatedAt(contact.getCreatedAt());
        response.setUpdatedAt(contact.getUpdatedAt());
        return response;
    }
} 