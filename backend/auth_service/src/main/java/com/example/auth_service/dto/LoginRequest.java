package com.example.auth_service.dto;

import lombok.Data;

@Data
public class LoginRequest {
    String username;
    String password;
}
