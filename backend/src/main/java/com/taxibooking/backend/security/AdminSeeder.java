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
        Admin admin = adminRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = new Admin();
            admin.setUsername("admin");
        }
        admin.setPasswordHash(passwordEncoder.encode("AdminPassword123"));
        adminRepository.save(admin);
        System.out.println("Default admin user ('admin' / 'AdminPassword123') forcefully updated!");
    }
}
