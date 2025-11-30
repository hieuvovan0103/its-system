package com.example.assessment_service.controller;

import com.example.assessment_service.application.service.IAssessmentService;
import com.example.assessment_service.domain.entity.*;
import com.example.assessment_service.dto.GradeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Assessment Service
 * Following the pattern from content-management-service
 *
 * Base path: /api/v1/assessments
 */
@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final IAssessmentService assessmentService;

    // ========== Assessment CRUD Endpoints ==========

    /**
     * POST /api/v1/assessments
     * Create a new assessment
     */
    @PostMapping
    public ResponseEntity<Assessment> createAssessment(@RequestBody Assessment assessment) {
        Assessment created = assessmentService.createAssessment(assessment);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/v1/assessments
     * Get all assessments
     */
    @GetMapping
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        return ResponseEntity.ok(assessmentService.getAllAssessments());
    }

    /**
     * GET /api/v1/assessments/{id}
     * Get assessment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Assessment> getAssessmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getAssessmentById(id));
    }

    /**
     * GET /api/v1/assessments/course/{courseId}
     * Get assessments by course
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Assessment>> getAssessmentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsByCourse(courseId));
    }

    /**
     * PUT /api/v1/assessments/{id}
     * Update an assessment
     */
    @PutMapping("/{id}")
    public ResponseEntity<Assessment> updateAssessment(
            @PathVariable Long id,
            @RequestBody Assessment assessment) {
        return ResponseEntity.ok(assessmentService.updateAssessment(id, assessment));
    }

    /**
     * DELETE /api/v1/assessments/{id}
     * Delete an assessment
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Question Endpoints ==========

    /**
     * POST /api/v1/assessments/{assessmentId}/questions
     * Add a question to an assessment
     */
    @PostMapping("/{assessmentId}/questions")
    public ResponseEntity<Question> addQuestion(
            @PathVariable Long assessmentId,
            @RequestBody Question question) {
        Question created = assessmentService.addQuestion(assessmentId, question);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/v1/assessments/{assessmentId}/questions
     * Get all questions for an assessment
     */
    @GetMapping("/{assessmentId}/questions")
    public ResponseEntity<List<Question>> getQuestionsByAssessment(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getQuestionsByAssessment(assessmentId));
    }

    /**
     * PUT /api/v1/assessments/{assessmentId}/questions/{questionId}
     * Update a question
     */
    @PutMapping("/{assessmentId}/questions/{questionId}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long assessmentId,
            @PathVariable Long questionId,
            @RequestBody Question question) {
        return ResponseEntity.ok(assessmentService.updateQuestion(assessmentId, questionId, question));
    }

    /**
     * DELETE /api/v1/assessments/{assessmentId}/questions/{questionId}
     * Delete a question
     */
    @DeleteMapping("/{assessmentId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long assessmentId,
            @PathVariable Long questionId) {
        assessmentService.deleteQuestion(assessmentId, questionId);
        return ResponseEntity.noContent().build();
    }

    // ========== Submission Endpoints ==========

    /**
     * POST /api/v1/assessments/{assessmentId}/submit
     * Submit an assessment (student submission)
     */
    @PostMapping("/{assessmentId}/submit")
    public ResponseEntity<Submission> submitAssessment(
            @PathVariable Long assessmentId,
            @RequestBody Submission submission) {
        submission.setAssessmentId(assessmentId);
        Submission saved = assessmentService.submitAssessment(submission);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * GET /api/v1/assessments/{assessmentId}/submissions
     * Get all submissions for an assessment
     */
    @GetMapping("/{assessmentId}/submissions")
    public ResponseEntity<List<Submission>> getSubmissionsByAssessment(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getSubmissionsByAssessment(assessmentId));
    }

    /**
     * GET /api/v1/assessments/submissions/{submissionId}
     * Get submission by ID
     */
    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Long submissionId) {
        return ResponseEntity.ok(assessmentService.getSubmissionById(submissionId));
    }

    /**
     * GET /api/v1/assessments/history/{studentId}
     * Get assessment history for a student
     */
    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<Submission>> getAssessmentHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(assessmentService.getAssessmentHistory(studentId));
    }

    // ========== Grading Endpoints ==========

    /**
     * POST /api/v1/assessments/submissions/{submissionId}/grade
     * Grade a submission
     */
    @PostMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<Grade> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody GradeRequest request) {
        Grade grade = assessmentService.gradeSubmission(
                submissionId,
                request.getGradedBy(),
                request.getFeedback());
        return ResponseEntity.ok(grade);
    }

    /**
     * GET /api/v1/assessments/submissions/{submissionId}/grade
     * Get grade for a submission
     */
    @GetMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<Grade> getGradeBySubmission(@PathVariable Long submissionId) {
        return ResponseEntity.ok(assessmentService.getGradeBySubmission(submissionId));
    }

    /**
     * PUT /api/v1/assessments/answers/{answerId}/score
     * Manually grade an answer (for Essay/Coding questions)
     */
    @PutMapping("/answers/{answerId}/score")
    public ResponseEntity<Answer> gradeAnswer(
            @PathVariable Long answerId,
            @RequestParam Double score) {
        return ResponseEntity.ok(assessmentService.gradeAnswer(answerId, score));
    }
}
