package com.example.assessment_service.domain.repository;

import com.example.assessment_service.domain.entity.Assessment;
import com.example.assessment_service.domain.entity.AssessmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Assessment entity
 * Extends JpaRepository following ITS Class Diagram pattern
 */
@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    // Find assessments by course
    List<Assessment> findByCourseId(Long courseId);

    // Find assessments by type
    List<Assessment> findByType(AssessmentType type);

    // Find assessments by title containing keyword
    List<Assessment> findByTitleContainingIgnoreCase(String keyword);

    // Find assessments by course and type
    List<Assessment> findByCourseIdAndType(Long courseId, AssessmentType type);
}
