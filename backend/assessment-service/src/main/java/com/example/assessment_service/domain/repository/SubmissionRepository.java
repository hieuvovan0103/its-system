package com.example.assessment_service.domain.repository;

import com.example.assessment_service.domain.entity.Submission;
import com.example.assessment_service.domain.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Submission entity
 * Following ITS Class Diagram: ISubmissionRepository
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Find submissions by student
    List<Submission> findByStudentId(Long studentId);

    // Find submissions by assessment
    List<Submission> findByAssessmentId(Long assessmentId);

    // Find submissions by student and assessment
    Optional<Submission> findByStudentIdAndAssessmentId(Long studentId, Long assessmentId);

    // Find submissions by status
    List<Submission> findByStatus(SubmissionStatus status);

    // Find submissions by student and status
    List<Submission> findByStudentIdAndStatus(Long studentId, SubmissionStatus status);

    // Find submissions within date range (for ITS Class Diagram: findByDateRange)
    List<Submission> findBySubmittedAtBetween(LocalDateTime from, LocalDateTime to);

    // Find all submissions for a student (assessment history)
    List<Submission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
}
