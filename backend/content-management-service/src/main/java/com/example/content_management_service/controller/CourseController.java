package com.example.content_management_service.controller;

import com.example.content_management_service.application.service.impl.CourseServiceImpl;
import com.example.content_management_service.dto.CourseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseServiceImpl courseService;

    // GET /api/v1/courses (Ai cũng xem được danh sách khóa học)
    @GetMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    public ResponseEntity<List<CourseDTO>> getAll() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // GET /api/v1/courses/{id} (Xem chi tiết khóa học + bài học)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    public ResponseEntity<CourseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // POST /api/v1/courses (Chỉ Giáo viên tạo khóa học)
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseDTO> create(@RequestBody CourseDTO dto) {
        return ResponseEntity.ok(courseService.createCourse(dto));
    }

    // PUT /api/v1/courses/{id} (Chỉ Giáo viên sửa)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseDTO> update(@PathVariable Long id, @RequestBody CourseDTO dto) {
        return ResponseEntity.ok(courseService.updateCourse(id, dto));
    }

    // DELETE /api/v1/courses/{id} (Chỉ Giáo viên xóa)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}