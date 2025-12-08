package com.example.content_management_service.security;

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

        System.out.println("DEBUG FILTER: URL = " + request.getRequestURI());
        System.out.println("DEBUG FILTER: Header Authorization = " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            boolean isValid = jwtUtils.validateJwtToken(token);
            System.out.println("DEBUG FILTER: Token Valid? " + isValid);

            if (isValid) {
                String username = jwtUtils.getUsernameFromJwtToken(token);
                String role = jwtUtils.getRoleFromJwtToken(token);

                System.out.println("DEBUG FILTER: Username extracted = " + username);
                System.out.println("DEBUG FILTER: Role extracted (Raw) = " + role);

                if (username != null && role != null) {
                    String authorityString = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                    System.out.println("DEBUG FILTER: Authority gán vào Context = " + authorityString);

                    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(authorityString));

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("DEBUG FILTER: Authentication set success!");
                }
            }
        } else {
            System.out.println("DEBUG FILTER: Không tìm thấy Token hợp lệ");
        }

        filterChain.doFilter(request, response);
    }
}