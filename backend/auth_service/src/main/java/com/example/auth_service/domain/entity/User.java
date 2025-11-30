package com.example.auth_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // Tên bảng trong DB
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // username không được trùng
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // email không được trùng
    @Column(unique = true, nullable = false)
    private String email;

    // Lưu Enum dưới dạng String (VD: "INSTRUCTOR") thay vì số (0, 1)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}