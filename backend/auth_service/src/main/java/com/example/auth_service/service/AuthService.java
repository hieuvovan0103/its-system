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

    // --- XỬ LÝ ĐĂNG KÝ ---
    public String register(RegisterRequest request) {
        // 1. Kiểm tra trùng lặp
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // 2. Tạo Entity User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // 3. Mã hóa mật khẩu (Bắt buộc)
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 4. Xử lý Role (Chuyển String -> Enum)
        try {
            // Mặc định là STUDENT nếu không gửi role
            String roleStr = request.getRole() == null ? "STUDENT" : request.getRole().toUpperCase();
            user.setRole(Role.valueOf(roleStr));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error: Role is invalid. Allowed: INSTRUCTOR, STUDENT");
        }

        // 5. Lưu xuống DB
        userRepository.save(user);
        return "User registered successfully!";
    }

    // --- XỬ LÝ ĐĂNG NHẬP ---
    public LoginResponse login(LoginRequest request) {
        // 1. Xác thực qua Spring Security (So sánh password hash)
        // Nếu sai pass, hàm này sẽ ném ra BadCredentialsException
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 2. Lưu thông tin vào SecurityContext (cho phiên làm việc hiện tại)
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Lấy thông tin user từ DB để lấy Role chuẩn
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 4. Sinh JWT Token (Dùng hàm trong JwtUtils)
        String jwt = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        // 5. Trả về DTO
        return new LoginResponse(jwt, "Bearer", user.getUsername(), user.getRole().name());
    }
}