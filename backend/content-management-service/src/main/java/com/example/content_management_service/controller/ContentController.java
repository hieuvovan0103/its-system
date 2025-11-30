package com.example.content_management_service.controller;

import com.example.content_management_service.application.service.impl.ContentServiceImpl;
import com.example.content_management_service.dto.ContentDTO; // ✅ Import DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
@PreAuthorize("hasRole('INSTRUCTOR')") // 🔒 Chỉ Instructor mới được vào
public class ContentController {

    private final ContentServiceImpl service;

    // 1. TẠO MỚI (Nhận DTO, Trả DTO)
    // POST: http://localhost:8081/api/v1/contents
    @PostMapping
    public ResponseEntity<ContentDTO> create(@RequestBody ContentDTO dto) {
        return ResponseEntity.ok(service.createContent(dto));
    }

    // 2. LẤY TẤT CẢ
    // GET: http://localhost:8081/api/v1/contents
    @GetMapping
    public ResponseEntity<List<ContentDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // 3. LẤY CHI TIẾT 1 BÀI
    // GET: http://localhost:8081/api/v1/contents/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ContentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // 4. CẬP NHẬT
    // PUT: http://localhost:8081/api/v1/contents/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ContentDTO> update(@PathVariable Long id, @RequestBody ContentDTO dto) {
        return ResponseEntity.ok(service.updateContent(id, dto));
    }

    // 5. XÓA
    // DELETE: http://localhost:8081/api/v1/contents/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteContent(id);
        return ResponseEntity.noContent().build();
    }

    // 6. LẤY BÀI HỌC THEO KHÓA HỌC (API Mới rất cần thiết)
    // GET: http://localhost:8081/api/v1/contents/course/{courseId}
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ContentDTO>> getByCourseId(@PathVariable Long courseId) {
        // Bạn cần thêm hàm getByCourseId vào ContentServiceImpl để API này hoạt động
        // return ResponseEntity.ok(service.getByCourseId(courseId));
        return null; // Tạm thời để null nếu bên Service chưa viết hàm này
    }
}