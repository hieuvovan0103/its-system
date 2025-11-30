package com.example.assessment_service.domain.repository;

import com.example.assessment_service.domain.entity.Question;
import com.example.assessment_service.domain.entity.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Question entity
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Find questions by assessment
    List<Question> findByAssessmentId(Long assessmentId);

    // Find questions by type
    List<Question> findByType(QuestionType type);

    // Find questions by assessment and type
    List<Question> findByAssessmentIdAndType(Long assessmentId, QuestionType type);
}
