package com.example.assessment_service.domain.repository;

import com.example.assessment_service.domain.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Answer entity
 */
@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // Find answers by submission
    List<Answer> findBySubmissionId(Long submissionId);

    // Find answer by submission and question
    Answer findBySubmissionIdAndQuestionId(Long submissionId, Long questionId);
}
