package com.pet_care_management.pet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pet_care_management.pet.dto.ContactRequest;
import com.pet_care_management.pet.dto.ContactResponse;
import com.pet_care_management.pet.service.ContactService;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/create")
    public ResponseEntity<ContactResponse> createContact(@RequestBody ContactRequest request) {
        ContactResponse response = contactService.createContact(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable Integer id) {
        ContactResponse response = contactService.getContactById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<List<ContactResponse>> getAllContacts() {
        List<ContactResponse> responses = contactService.getAllContacts();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<ContactResponse> updateContactStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        ContactResponse response = contactService.updateContactStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'doctor')")
    public ResponseEntity<Void> deleteContact(@PathVariable Integer id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
} 