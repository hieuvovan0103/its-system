package com.example.assessment_service.dto;

import com.example.assessment_service.domain.entity.AssessmentType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Assessment entity
 */
@Data
public class AssessmentDTO {
    private Long id;
    private String title;
    private String description;
    private AssessmentType type;
    private Long courseId;
    private Double totalScore;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;

    // Added field to hold the list of questions
    private List<QuestionDTO> questions;
}