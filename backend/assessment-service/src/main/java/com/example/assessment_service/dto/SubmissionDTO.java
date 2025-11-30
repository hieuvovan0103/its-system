package com.example.assessment_service.dto;

import com.example.assessment_service.domain.entity.SubmissionStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Submission entity
 */
@Data
public class SubmissionDTO {
    private Long id;
    private Long assessmentId;
    private Long studentId;
    private SubmissionStatus status;
    private LocalDateTime submittedAt;
    private List<AnswerDTO> answers;
}
