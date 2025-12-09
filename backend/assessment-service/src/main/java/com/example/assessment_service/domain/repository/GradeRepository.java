package com.example.assessment_service.domain.repository;

import com.example.assessment_service.domain.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Grade entity
 */
@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    Optional<Grade> findBySubmissionId(Long submissionId);
}
