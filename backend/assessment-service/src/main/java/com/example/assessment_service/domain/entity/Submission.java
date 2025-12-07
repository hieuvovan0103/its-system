package com.example.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Submission entity - represents a student's submission for an assessment
 * Based on ITS Class Diagram
 */
@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assessment_id", nullable = false)
    private Long assessmentId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude // 💡 Tùy chọn: Loại trừ khỏi toString() để tránh lỗi khi in log
    private List<Answer> answers = new ArrayList<>();

    @OneToOne(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude // 💡 Tùy chọn: Loại trừ khỏi toString()
    private Grade grade;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = SubmissionStatus.DRAFT;
        }
    }

    // Helper method to add answer
    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setSubmission(this);
    }

    // Submit the assessment
    public void submit() {
        this.status = SubmissionStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();
    }

    // Calculate total score from all answers
    public Double calculateTotalScore() {
        return answers.stream()
                .filter(a -> a.getScore() != null)
                .mapToDouble(Answer::getScore)
                .sum();
    }
}
