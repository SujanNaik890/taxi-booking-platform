package com.taxibooking.backend.controllers;

import com.taxibooking.backend.dto.LoginRequest;
import com.taxibooking.backend.dto.LoginResponse;
import com.taxibooking.backend.dto.RegisterRequest;
import com.taxibooking.backend.models.Passenger;
import com.taxibooking.backend.repositories.PassengerRepository;
import com.taxibooking.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            // Get user details and role from authentication principal
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            
            String token = jwtUtil.generateToken(userDetails.getUsername());
            
            String name = null;
            String phone = null;
            
            if ("ROLE_PASSENGER".equals(role)) {
                Passenger passenger = passengerRepository.findByEmail(userDetails.getUsername())
                        .or(() -> passengerRepository.findByPhone(userDetails.getUsername()))
                        .orElse(null);
                if (passenger != null) {
                    name = passenger.getName();
                    phone = passenger.getPhone();
                }
            } else if ("ROLE_ADMIN".equals(role)) {
                name = "Administrator";
            }
            
            return ResponseEntity.ok(new LoginResponse(token, userDetails.getUsername(), role, name, phone));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username/phone or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (passengerRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }
        if (passengerRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest().body("Phone number is already registered");
        }

        Passenger passenger = new Passenger();
        passenger.setName(request.getName());
        passenger.setEmail(request.getEmail());
        passenger.setPhone(request.getPhone());
        passenger.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        Passenger saved = passengerRepository.save(passenger);
        return ResponseEntity.ok(saved);
    }
}
