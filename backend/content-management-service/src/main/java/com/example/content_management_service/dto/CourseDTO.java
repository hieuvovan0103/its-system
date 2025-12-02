package com.example.content_management_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class CourseDTO {
    private Long id;
    private String title;
    private String description;

    // Danh sách bài học nằm trong khóa học này
    // (Dùng để hiển thị cấu trúc khóa học ở Frontend)
    private List<ContentDTO> contents;
}