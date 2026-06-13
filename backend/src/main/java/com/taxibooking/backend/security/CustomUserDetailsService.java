package com.taxibooking.backend.security;

import com.taxibooking.backend.models.Admin;
import com.taxibooking.backend.models.Passenger;
import com.taxibooking.backend.repositories.AdminRepository;
import com.taxibooking.backend.repositories.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Check if user is an Admin
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return new User(
                    admin.get().getUsername(),
                    admin.get().getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // 2. Check if user is a Passenger (can login by email or phone)
        Optional<Passenger> passenger = passengerRepository.findByEmail(username)
                .or(() -> passengerRepository.findByPhone(username));
        if (passenger.isPresent()) {
            return new User(
                    passenger.get().getEmail(),
                    passenger.get().getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_PASSENGER"))
            );
        }

        throw new UsernameNotFoundException("User not found with identifier: " + username);
    }
}
