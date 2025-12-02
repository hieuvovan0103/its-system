package com.example.content_management_service.application.service.impl;

import com.example.content_management_service.domain.entity.Course;
import com.example.content_management_service.domain.repository.CourseRepository;
import com.example.content_management_service.dto.ContentDTO;
import com.example.content_management_service.dto.CourseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl {

    private final CourseRepository courseRepository;

    // --- 1. LẤY TẤT CẢ KHÓA HỌC ---
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDTO) // Chỉ map thông tin cơ bản
                .collect(Collectors.toList());
    }

    // --- 2. LẤY CHI TIẾT KHÓA HỌC (Kèm danh sách Content) ---
    @Transactional(readOnly = true) // Transaction để load Lazy list contents
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        // Map sang DTO (bao gồm cả list contents)
        return mapToDTOWithContents(course);
    }

    // --- 3. TẠO KHÓA HỌC MỚI ---
    public CourseDTO createCourse(CourseDTO dto) {
        Course entity = new Course();
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());

        Course saved = courseRepository.save(entity);
        return mapToDTO(saved);
    }

    // --- 4. CẬP NHẬT KHÓA HỌC ---
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course current = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        current.setTitle(dto.getTitle());
        current.setDescription(dto.getDescription());

        return mapToDTO(courseRepository.save(current));
    }

    // --- 5. XÓA KHÓA HỌC ---
    public void deleteCourse(Long id) {
        // Lưu ý: Nếu trong Entity Course để CascadeType.ALL thì Content con sẽ bị xóa theo
        courseRepository.deleteById(id);
    }

    // Helper: Map cơ bản (Không lấy list content để tránh nặng)
    private CourseDTO mapToDTO(Course entity) {
        CourseDTO dto = new CourseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    // Helper: Map đầy đủ (Lấy cả list content)
    private CourseDTO mapToDTOWithContents(Course entity) {
        CourseDTO dto = mapToDTO(entity);

        // Chuyển đổi List<Entity> -> List<DTO> cho content
        if (entity.getContents() != null) {
            List<ContentDTO> contentDTOs = entity.getContents().stream()
                    .map(content -> {
                        ContentDTO cDto = new ContentDTO();
                        cDto.setId(content.getId());
                        cDto.setTitle(content.getTitle());
                        cDto.setType(content.getType());
                        cDto.setUrl(content.getUrl());
                        cDto.setCourseId(entity.getId());
                        return cDto;
                    }).collect(Collectors.toList());
            dto.setContents(contentDTOs);
        }
        return dto;
    }
}