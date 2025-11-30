package com.example.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

/**
 * Grade entity - represents the final grade for a submission
 * Based on ITS Class Diagram
 */
@Entity
@Table(name = "grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_score", nullable = false)
    private Double totalScore;

    @Column(name = "max_score")
    private Double maxScore;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @Column(name = "graded_by")
    private String gradedBy;

    // Optional feedback message
    @Column(columnDefinition = "TEXT")
    private String feedback;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Submission submission;

    @PrePersist
    protected void onCreate() {
        gradedAt = LocalDateTime.now();
    }

    /**
     * Calculate percentage score
     */
    public Double getPercentage() {
        if (maxScore == null || maxScore == 0) {
            return 0.0;
        }
        return (totalScore / maxScore) * 100;
    }

    /**
     * Get letter grade based on percentage
     */
    public String getLetterGrade() {
        double percentage = getPercentage();
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    }
}
