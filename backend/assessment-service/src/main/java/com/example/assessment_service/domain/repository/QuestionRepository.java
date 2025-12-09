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

    List<Question> findByAssessmentId(Long assessmentId);

    List<Question> findByType(QuestionType type);

    List<Question> findByAssessmentIdAndType(Long assessmentId, QuestionType type);
}
