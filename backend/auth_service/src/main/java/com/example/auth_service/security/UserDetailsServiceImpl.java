package com.example.auth_service.security;

import com.example.auth_service.domain.entity.User;
import com.example.auth_service.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Tìm user bằng email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. Map vào UserDetails của Spring
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) // 👈 TRICK: Gán Email vào chỗ Username của Spring
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}