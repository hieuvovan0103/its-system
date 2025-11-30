package com.example.assessment_service.application.service;

import com.example.assessment_service.domain.entity.*;
import java.util.List;

/**
 * Assessment Service Interface
 * Based on ITS Class Diagram: IAssessmentService
 *
 * Responsibilities:
 * - Create and manage assessments
 * - Manage questions within assessments
 * - Handle student submissions
 * - Grade submissions
 * - Track assessment history
 */
public interface IAssessmentService {

    // ========== Assessment CRUD ==========

    /**
     * Create a new assessment
     * @param assessment Assessment entity to create
     * @return Created assessment with generated ID
     */
    Assessment createAssessment(Assessment assessment);

    /**
     * Get assessment by ID
     * @param id Assessment ID
     * @return Assessment entity
     */
    Assessment getAssessmentById(Long id);

    /**
     * Get all assessments
     * @return List of all assessments
     */
    List<Assessment> getAllAssessments();

    /**
     * Get assessments by course
     * @param courseId Course ID
     * @return List of assessments for the course
     */
    List<Assessment> getAssessmentsByCourse(Long courseId);

    /**
     * Update an assessment
     * @param id Assessment ID
     * @param assessment Updated assessment data
     * @return Updated assessment
     */
    Assessment updateAssessment(Long id, Assessment assessment);

    /**
     * Delete an assessment
     * @param id Assessment ID
     */
    void deleteAssessment(Long id);

    // ========== Question Management ==========

    /**
     * Add a question to an assessment
     * Based on ITS Class Diagram: addQuestion(assessmentId, question)
     * @param assessmentId Assessment ID
     * @param question Question to add
     * @return Created question
     */
    Question addQuestion(Long assessmentId, Question question);

    /**
     * Update a question
     * @param assessmentId Assessment ID
     * @param questionId Question ID
     * @param question Updated question data
     * @return Updated question
     */
    Question updateQuestion(Long assessmentId, Long questionId, Question question);

    /**
     * Delete a question from an assessment
     * @param assessmentId Assessment ID
     * @param questionId Question ID
     */
    void deleteQuestion(Long assessmentId, Long questionId);

    /**
     * Get all questions for an assessment
     * @param assessmentId Assessment ID
     * @return List of questions
     */
    List<Question> getQuestionsByAssessment(Long assessmentId);

    // ========== Submission Management ==========

    /**
     * Submit an assessment (student submission)
     * Based on ITS Class Diagram: submitAssessment(submission)
     * @param submission Submission with answers
     * @return Saved submission
     */
    Submission submitAssessment(Submission submission);

    /**
     * Get submission by ID
     * @param submissionId Submission ID
     * @return Submission entity
     */
    Submission getSubmissionById(Long submissionId);

    /**
     * Get all submissions for an assessment
     * @param assessmentId Assessment ID
     * @return List of submissions
     */
    List<Submission> getSubmissionsByAssessment(Long assessmentId);

    /**
     * Get assessment history for a student
     * Based on ITS Class Diagram: getAssessmentHistory(studentId)
     * @param studentId Student ID
     * @return List of student's submissions
     */
    List<Submission> getAssessmentHistory(Long studentId);

    // ========== Grading ==========

    /**
     * Grade a submission
     * Based on ITS Class Diagram: gradeSubmission(submissionId)
     * @param submissionId Submission ID
     * @param gradedBy Grader identifier
     * @param feedback Optional feedback message
     * @return Grade entity
     */
    Grade gradeSubmission(Long submissionId, String gradedBy, String feedback);

    /**
     * Manually set score for an answer (for Essay/Coding questions)
     * @param answerId Answer ID
     * @param score Score to set
     * @return Updated answer
     */
    Answer gradeAnswer(Long answerId, Double score);

    /**
     * Get grade for a submission
     * @param submissionId Submission ID
     * @return Grade entity
     */
    Grade getGradeBySubmission(Long submissionId);
}
