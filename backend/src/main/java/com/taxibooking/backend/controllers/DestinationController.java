package com.taxibooking.backend.controllers;

import com.taxibooking.backend.models.Destination;
import com.taxibooking.backend.services.DestinationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    // Public: List all destinations
    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    // Admin: Add a new destination
    @PostMapping
    public ResponseEntity<Destination> addDestination(@Valid @RequestBody Destination destination) {
        return ResponseEntity.ok(destinationService.saveDestination(destination));
    }

    // Admin: Edit a destination
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDestination(@PathVariable String id, @Valid @RequestBody Destination destinationDetails) {
        try {
            Destination updated = destinationService.updateDestination(id, destinationDetails);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Delete a destination
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable String id) {
        try {
            destinationService.deleteDestination(id);
            return ResponseEntity.ok().body("Destination deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
