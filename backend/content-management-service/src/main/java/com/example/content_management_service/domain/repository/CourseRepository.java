package com.example.content_management_service.domain.repository;

import com.example.content_management_service.domain.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTitleContainingIgnoreCase(String keyword);
    boolean existsByTitle(String title);
}