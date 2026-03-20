package com.codenexuss.backend.controller;

import com.codenexuss.backend.model.Contact;
import com.codenexuss.backend.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @PostMapping("/submit")
    public ResponseEntity<String> submitContactForm(@RequestBody Contact contact) {
        contactRepository.save(contact);
        return ResponseEntity.ok("Message received! We will get back to you soon.");
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getAllMessages(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.equals("Bearer valid-admin-token")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(contactRepository.findAll());
    }
}
