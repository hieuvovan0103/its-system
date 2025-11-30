package com.example.content_management_service.domain.repository;

import com.example.content_management_service.domain.entity.LearningContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<LearningContent, Long> {
    List<LearningContent> findByCourseId(Long courseId);
}