package com.example.assessment_service.dto;

import com.example.assessment_service.domain.entity.QuestionType;
import lombok.Data;
import java.util.List;

/**
 * DTO for Question entity
 */
@Data
public class QuestionDTO {
    private Long id;
    private String text;
    private QuestionType type;
    private Double score;
    private List<String> options;
    private Integer correctOptionIndex;
    private Integer maxLengthAnswer;
    private String rubric;
}
