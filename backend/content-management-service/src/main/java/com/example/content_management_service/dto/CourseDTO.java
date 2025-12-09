package com.example.content_management_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private List<ContentDTO> contents;
}