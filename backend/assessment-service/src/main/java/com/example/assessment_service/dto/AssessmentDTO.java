package com.example.assessment_service.dto;

import com.example.assessment_service.domain.entity.AssessmentType;
import lombok.Data;
import java.time.LocalDateTime;

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
}
