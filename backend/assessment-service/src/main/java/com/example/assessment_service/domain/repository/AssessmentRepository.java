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

    List<Assessment> findByCourseId(Long courseId);

    List<Assessment> findByType(AssessmentType type);

    List<Assessment> findByTitleContainingIgnoreCase(String keyword);

    List<Assessment> findByCourseIdAndType(Long courseId, AssessmentType type);
}
