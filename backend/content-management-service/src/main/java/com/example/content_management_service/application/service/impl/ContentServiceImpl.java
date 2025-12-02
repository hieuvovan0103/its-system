package com.example.content_management_service.application.service.impl;

import com.example.content_management_service.application.service.ContentService; // Nếu có interface
import com.example.content_management_service.domain.entity.Course;
import com.example.content_management_service.domain.entity.LearningContent;
import com.example.content_management_service.domain.repository.ContentRepository;
import com.example.content_management_service.domain.repository.CourseRepository;
import com.example.content_management_service.dto.ContentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentServiceImpl { // Hoặc implements ContentService nếu bạn đã tạo interface

    private final ContentRepository contentRepository;
    private final CourseRepository courseRepository; // ✅ Cần thêm cái này để tìm Course

    // --- 1. CREATE (Tạo mới chuẩn logic 1-n) ---
    public ContentDTO createContent(ContentDTO dto) {
        // B1: Tìm Course cha trước
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Course ID: " + dto.getCourseId()));

        // B2: Map DTO -> Entity
        LearningContent entity = new LearningContent();
        entity.setTitle(dto.getTitle());
        entity.setType(dto.getType());
        entity.setUrl(dto.getUrl());
        entity.setCourse(course); // ✅ Gán quan hệ vào đây

        // B3: Lưu và trả về DTO
        LearningContent saved = contentRepository.save(entity);
        return mapToDTO(saved);
    }

    // --- 2. READ (Trả về DTO) ---
    public List<ContentDTO> getAll() {
        return contentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ContentDTO getById(Long id) {
        LearningContent entity = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học ID: " + id));
        return mapToDTO(entity);
    }

    // --- 3. UPDATE (Cập nhật có xử lý đổi Course) ---
    @Transactional
    public ContentDTO updateContent(Long id, ContentDTO dto) {
        LearningContent current = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // Cập nhật thông tin cơ bản
        current.setTitle(dto.getTitle());
        current.setType(dto.getType());
        current.setUrl(dto.getUrl());

        // Logic: Nếu muốn chuyển bài học sang Course khác
        if (dto.getCourseId() != null && !dto.getCourseId().equals(current.getCourse().getId())) {
            Course newCourse = courseRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new RuntimeException("New Course not found"));
            current.setCourse(newCourse);
        }

        LearningContent updated = contentRepository.save(current);
        return mapToDTO(updated);
    }

    // --- 4. DELETE ---
    public void deleteContent(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new RuntimeException("Bài học không tồn tại để xóa");
        }
        contentRepository.deleteById(id);
    }

    // --- HELPER: Map Entity sang DTO ---
    private ContentDTO mapToDTO(LearningContent entity) {
        ContentDTO dto = new ContentDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setType(entity.getType());
        dto.setUrl(entity.getUrl());

        // Flatten dữ liệu để Frontend dễ dùng
        if (entity.getCourse() != null) {
            dto.setCourseId(entity.getCourse().getId());
            dto.setCourseName(entity.getCourse().getTitle());
        }
        return dto;
    }
    public List<ContentDTO> getByCourseId(Long courseId) {
        return contentRepository.findByCourseId(courseId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}