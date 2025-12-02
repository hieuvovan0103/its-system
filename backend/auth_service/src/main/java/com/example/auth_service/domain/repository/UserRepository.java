package com.example.auth_service.domain.repository;

import com.example.auth_service.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // ✅ Chỉ cần tìm theo Email
    Optional<User> findByEmail(String email);

    // ✅ Chỉ cần check trùng Email
    Boolean existsByEmail(String email);
}