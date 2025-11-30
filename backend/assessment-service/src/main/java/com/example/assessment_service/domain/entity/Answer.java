package com.example.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Answer entity - represents a student's answer to a question
 * Based on ITS Class Diagram
 */
@Entity
@Table(name = "answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    // Text content of the answer (for Essay/Coding) or empty for MCQ
    @Column(columnDefinition = "TEXT")
    private String content;

    // Selected option index for MCQ questions
    @Column(name = "selected_option_index")
    private Integer selectedOptionIndex;

    // Score received for this answer (set after grading)
    private Double score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    @JsonIgnore
    @ToString.Exclude
    private Submission submission;

    /**
     * Evaluate and set score for this answer
     * For MCQ: automatic based on correctOptionIndex
     * For Essay/Coding: manual grading required
     */
    public Double evaluate(Question question) {
        if (question.getType() == QuestionType.MCQ) {
            if (question.getCorrectOptionIndex() != null &&
                question.getCorrectOptionIndex().equals(selectedOptionIndex)) {
                this.score = question.getScore();
            } else {
                this.score = 0.0;
            }
        }
        // For Essay and Coding, score is set manually by instructor
        return this.score;
    }
}
