package com.example.assessment_service.dto;

import lombok.Data;

/**
 * Request DTO for grading a submission
 */
@Data
public class GradeRequest {
    private String gradedBy;
    private String feedback;
}
