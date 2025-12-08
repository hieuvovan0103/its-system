package com.example.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssessmentType type;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "total_score")
    private Double totalScore;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (totalScore == null) {
            totalScore = 0.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to add question
    public void addQuestion(Question question) {
        questions.add(question);
        question.setAssessment(this);
        recalculateTotalScore();
    }

    // Helper method to remove question
    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setAssessment(null);
        recalculateTotalScore();
    }

    // Recalculate total score from all questions
    public void recalculateTotalScore() {
        this.totalScore = questions.stream()
                .mapToDouble(Question::getScore)
                .sum();
    }
}
