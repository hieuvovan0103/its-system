package com.example.assessment_service.application.service;

import com.example.assessment_service.domain.entity.*;
import java.util.List;

public interface IAssessmentService {

    Assessment createAssessment(Assessment assessment);

    Assessment getAssessmentById(Long id);

    List<Assessment> getAllAssessments();

    List<Assessment> getAssessmentsByCourse(Long courseId);

    Assessment updateAssessment(Long id, Assessment assessment);

    void deleteAssessment(Long id);

    Question addQuestion(Long assessmentId, Question question);

    Question updateQuestion(Long assessmentId, Long questionId, Question question);

    void deleteQuestion(Long assessmentId, Long questionId);

    List<Question> getQuestionsByAssessment(Long assessmentId);

    Submission submitAssessment(Submission submission);

    Submission getSubmissionById(Long submissionId);

    List<Submission> getSubmissionsByAssessment(Long assessmentId);

    List<Submission> getAssessmentHistory(Long studentId);

    Grade gradeSubmission(Long submissionId, String gradedBy, String feedback);

    Answer gradeAnswer(Long answerId, Double score);

    Grade getGradeBySubmission(Long submissionId);
}
