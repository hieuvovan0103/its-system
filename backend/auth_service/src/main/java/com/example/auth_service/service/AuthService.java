package com.example.auth_service.service;

import com.example.auth_service.domain.entity.Role;
import com.example.auth_service.domain.entity.User;
import com.example.auth_service.domain.repository.UserRepository;
import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.LoginResponse;
import com.example.auth_service.dto.RegisterRequest;
import com.example.auth_service.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // --- ĐĂNG KÝ ---
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail()); // Chỉ set Email
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            String roleStr = request.getRole() == null ? "STUDENT" : request.getRole().toUpperCase();
            user.setRole(Role.valueOf(roleStr));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid Role");
        }

        userRepository.save(user);
        return "User registered successfully!";
    }

    // --- ĐĂNG NHẬP ---
    public LoginResponse login(LoginRequest request) {
        // 1. Xác thực (Spring Security sẽ gọi loadUserByUsername ở bước 5)
        // Chúng ta truyền Email vào vị trí của principal
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Tìm user để lấy Role (Tìm bằng Email)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Sinh Token (Subject của token bây giờ là Email)
        String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(jwt, "Bearer", user.getEmail(), user.getRole().name());
    }
}