package com.example.assessment_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtils.validateJwtToken(token)) {
                String username = jwtUtils.getUsernameFromJwtToken(token);
                String rawRole = jwtUtils.getRoleFromJwtToken(token); // Lấy chuỗi thô

                if (username != null && rawRole != null) {
                    // 1. Chuẩn hóa: Chuyển hết về chữ in hoa để tránh lỗi case-sensitive
                    String upperRole = rawRole.toUpperCase();

                    // 2. Xử lý tiền tố: Nếu chưa có "ROLE_" thì thêm, có rồi thì thôi
                    String finalRole = upperRole.startsWith("ROLE_") ? upperRole : "ROLE_" + upperRole;

                    // DEBUG: In ra để xem chính xác nó đang là cái gì (Quan trọng để check log)
                    System.out.println("DEBUG SECURITY - User: " + username + " | Final Authority: " + finalRole);

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(finalRole);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, List.of(authority));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}