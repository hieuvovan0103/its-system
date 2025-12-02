package com.example.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // 🔥 CHẠY ĐẦU TIÊN: Để tránh bị Spring Security chặn 403
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 1. Cho phép Frontend gọi vào
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // 2. Cho phép gửi Credentials (Cookie, Auth Header...)
        config.setAllowCredentials(true);

        // 3. Cho phép tất cả các Header
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-auth-token"));

        // 4. Cho phép các Method
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 5. Cache cấu hình này trong 1 giờ để trình duyệt đỡ hỏi nhiều
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}