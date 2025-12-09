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

    List<Submission> findByStudentId(Long studentId);

    List<Submission> findByAssessmentId(Long assessmentId);

    Optional<Submission> findByStudentIdAndAssessmentId(Long studentId, Long assessmentId);

    List<Submission> findByStatus(SubmissionStatus status);

    List<Submission> findByStudentIdAndStatus(Long studentId, SubmissionStatus status);

    List<Submission> findBySubmittedAtBetween(LocalDateTime from, LocalDateTime to);

    List<Submission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
}
