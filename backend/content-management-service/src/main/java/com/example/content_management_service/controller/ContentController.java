package com.example.content_management_service.controller;

import com.example.content_management_service.  application.service.impl.ContentServiceImpl;
import com.example.content_management_service.domain.entity.LearningContent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
public class ContentController {

    private final ContentServiceImpl service;

    // POST: http://localhost:8082/api/v1/contents
    @PostMapping
    public ResponseEntity<LearningContent> create(@RequestBody LearningContent content) {
        return ResponseEntity.ok(service.createContent(content));
    }

    // GET: http://localhost:8082/api/v1/contents
    @GetMapping
    public ResponseEntity<List<LearningContent>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // PUT: http://localhost:8082/api/v1/contents/{id}
    @PutMapping("/{id}")
    public ResponseEntity<LearningContent> update(@PathVariable Long id, @RequestBody LearningContent content) {
        return ResponseEntity.ok(service.updateContent(id, content));
    }

    // DELETE: http://localhost:8082/api/v1/contents/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteContent(id);
        return ResponseEntity.noContent().build();
    }
}