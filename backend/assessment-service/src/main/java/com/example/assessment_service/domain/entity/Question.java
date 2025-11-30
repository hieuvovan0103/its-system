package com.example.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

/**
 * Question entity - represents a question in an assessment
 * Supports MCQ, Essay, and Coding question types
 * Based on ITS Class Diagram
 */
@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false)
    private Double score;

    // For MCQ questions - stored as JSON array
    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options;

    // For MCQ questions - index of correct answer
    @Column(name = "correct_option_index")
    private Integer correctOptionIndex;

    // For Essay questions
    @Column(name = "max_length_answer")
    private Integer maxLengthAnswer;

    // For Essay questions - grading rubric
    @Column(columnDefinition = "TEXT")
    private String rubric;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    @JsonIgnore
    @ToString.Exclude
    private Assessment assessment;

    /**
     * Calculate score for this question based on answer
     */
    public Double calculateScore(String answerContent, Integer selectedOptionIndex) {
        if (type == QuestionType.MCQ && correctOptionIndex != null && selectedOptionIndex != null) {
            return correctOptionIndex.equals(selectedOptionIndex) ? score : 0.0;
        }
        // For Essay and Coding, manual grading is needed
        return 0.0;
    }
}
