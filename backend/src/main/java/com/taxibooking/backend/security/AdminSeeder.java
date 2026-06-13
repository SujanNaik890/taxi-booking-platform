package com.taxibooking.backend.security;

import com.taxibooking.backend.models.Admin;
import com.taxibooking.backend.repositories.AdminRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seedAdmin() {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            // BCrypt hash of "AdminPassword123"
            admin.setPasswordHash(passwordEncoder.encode("AdminPassword123"));
            adminRepository.save(admin);
            System.out.println("Default admin user ('admin' / 'AdminPassword123') seeded successfully!");
        }
    }
}
