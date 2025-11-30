package com.example.assessment_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for Grade entity
 */
@Data
public class GradeDTO {
    private Long id;
    private Long submissionId;
    private Double totalScore;
    private Double maxScore;
    private String gradedBy;
    private String feedback;
    private LocalDateTime gradedAt;
    private Double percentage;
    private String letterGrade;
}
