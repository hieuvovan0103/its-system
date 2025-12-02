package com.example.api_gateway.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

// Import tĩnh các hàm helper
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.web.servlet.function.RequestPredicates.path;

@Configuration
public class GatewayConfig {

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route("auth_service")
                // Auth Service -> 8084
                .route(path("/api/v1/auth/**"), http("http://localhost:8084"))
                .build()

                .and(route("content_service")
                        // ✅ SỬA DÒNG NÀY: Content Service -> 8082 (Khớp file properties của bạn)
                        .route(path("/api/v1/contents/**"), http("http://localhost:8082"))
                        .build())

                .and(route("course_service")
                        // ✅ SỬA DÒNG NÀY: Course API cũng nằm trong Content Service -> 8082
                        .route(path("/api/v1/courses/**"), http("http://localhost:8082"))
                        .build())

                .and(route("assessment_service")
                        // Assessment Service -> 8081 (Để tránh trùng)
                        .route(path("/api/v1/assessments/**"), http("http://localhost:8081"))
                        .build());
    }
}