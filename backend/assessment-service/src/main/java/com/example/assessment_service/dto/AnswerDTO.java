package com.example.assessment_service.dto;

import lombok.Data;

/**
 * DTO for Answer entity
 */
@Data
public class AnswerDTO {
    private Long id;
    private Long questionId;
    private String content;
    private Integer selectedOptionIndex;
    private Double score;
}
