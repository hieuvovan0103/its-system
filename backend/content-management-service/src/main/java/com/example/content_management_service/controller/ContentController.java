package com.example.content_management_service.controller;

import com.example.content_management_service.application.service.impl.ContentServiceImpl;
import com.example.content_management_service.dto.ContentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
public class ContentController {

    private final ContentServiceImpl service;

    @GetMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    public ResponseEntity<List<ContentDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    public ResponseEntity<ContentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    public ResponseEntity<List<ContentDTO>> getByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(service.getByCourseId(courseId));
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ContentDTO> create(@RequestBody ContentDTO dto) {
        return ResponseEntity.ok(service.createContent(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ContentDTO> update(@PathVariable Long id, @RequestBody ContentDTO dto) {
        return ResponseEntity.ok(service.updateContent(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteContent(id);
        return ResponseEntity.noContent().build();
    }
}