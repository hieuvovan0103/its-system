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
                .route(path("/api/v1/auth/**"), http("http://localhost:8083"))
                .build() // 1. Chấm dứt route này bằng build()

                .and(route("content_service") // 2. Nối tiếp bằng .and()
                        .route(path("/api/v1/contents/**"), http("http://localhost:8081"))
                        .build()) // Chấm dứt route này

                .and(route("assessment_service") // 3. Nối tiếp tiếp
                        .route(path("/api/v1/assessments/**"), http("http://localhost:8082"))
                        .build()); // Chấm dứt route cuối cùng
    }
}