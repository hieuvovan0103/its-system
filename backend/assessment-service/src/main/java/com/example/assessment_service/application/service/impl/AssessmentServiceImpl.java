package com.example.assessment_service.application.service.impl;

import com.example.assessment_service.application.service.IAssessmentService;
import com.example.assessment_service.domain.entity.*;
import com.example.assessment_service.domain.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements IAssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final SubmissionRepository submissionRepository;
    private final AnswerRepository answerRepository;
    private final GradeRepository gradeRepository;


    @Override
    public Assessment createAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    @Override
    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with ID: " + id));
    }

    @Override
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @Override
    public List<Assessment> getAssessmentsByCourse(Long courseId) {
        return assessmentRepository.findByCourseId(courseId);
    }

    @Override
    @Transactional
    public Assessment updateAssessment(Long id, Assessment assessment) {
        Assessment existing = getAssessmentById(id);
        existing.setTitle(assessment.getTitle());
        existing.setDescription(assessment.getDescription());
        existing.setType(assessment.getType());
        existing.setCourseId(assessment.getCourseId());
        existing.setDueDate(assessment.getDueDate());
        return assessmentRepository.save(existing);
    }

    @Override
    public void deleteAssessment(Long id) {
        assessmentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Question addQuestion(Long assessmentId, Question question) {
        Assessment assessment = getAssessmentById(assessmentId);
        question.setAssessment(assessment);
        Question savedQuestion = questionRepository.save(question);

        assessment.recalculateTotalScore();
        assessmentRepository.save(assessment);

        return savedQuestion;
    }

    @Override
    @Transactional
    public Question updateQuestion(Long assessmentId, Long questionId, Question question) {
        Question existing = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));

        if (!existing.getAssessment().getId().equals(assessmentId)) {
            throw new RuntimeException("Question does not belong to this assessment");
        }

        Double oldScore = existing.getScore();

        existing.setText(question.getText());
        existing.setType(question.getType());
        existing.setScore(question.getScore());
        existing.setOptions(question.getOptions());
        existing.setCorrectOptionIndex(question.getCorrectOptionIndex());
        existing.setMaxLengthAnswer(question.getMaxLengthAnswer());
        existing.setRubric(question.getRubric());

        Question updated = questionRepository.save(existing);

        if (!oldScore.equals(question.getScore())) {
            Assessment assessment = existing.getAssessment();
            assessment.recalculateTotalScore();
            assessmentRepository.save(assessment);
        }

        return updated;
    }

    @Override
    @Transactional
    public void deleteQuestion(Long assessmentId, Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));

        if (!question.getAssessment().getId().equals(assessmentId)) {
            throw new RuntimeException("Question does not belong to this assessment");
        }

        Assessment assessment = question.getAssessment();
        assessment.removeQuestion(question);
        assessmentRepository.save(assessment);
    }

    @Override
    public List<Question> getQuestionsByAssessment(Long assessmentId) {
        return questionRepository.findByAssessmentId(assessmentId);
    }

    @Override
    @Transactional
    public Submission submitAssessment(Submission submission) {
        Assessment assessment = getAssessmentById(submission.getAssessmentId());

        Map<Long, Question> questionMap = assessment.getQuestions().stream()
                .collect(java.util.stream.Collectors.toMap(Question::getId, q -> q));

        for (Answer answer : submission.getAnswers()) {
            answer.setSubmission(submission);
            Question question = questionMap.get(answer.getQuestionId());
            if (question != null && question.getType() == QuestionType.MCQ) {
                answer.evaluate(question);
            }
        }
        submission.submit();

        return submissionRepository.save(submission);
    }

    @Override
    public Submission getSubmissionById(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + submissionId));
    }

    @Override
    public List<Submission> getSubmissionsByAssessment(Long assessmentId) {
        return submissionRepository.findByAssessmentId(assessmentId);
    }

    @Override
    public List<Submission> getAssessmentHistory(Long studentId) {
        return submissionRepository.findByStudentIdOrderBySubmittedAtDesc(studentId);
    }


    @Override
    @Transactional
    public Grade gradeSubmission(Long submissionId, String gradedBy, String feedback) {
        Submission submission = getSubmissionById(submissionId);
        Assessment assessment = getAssessmentById(submission.getAssessmentId());

        Double totalScore = submission.calculateTotalScore();

        Grade grade = gradeRepository.findBySubmissionId(submissionId)
                .orElse(new Grade());

        grade.setSubmission(submission);
        grade.setTotalScore(totalScore);
        grade.setMaxScore(assessment.getTotalScore());
        grade.setGradedBy(gradedBy);
        grade.setFeedback(feedback);

        Grade savedGrade = gradeRepository.save(grade);

        submission.setStatus(SubmissionStatus.GRADED);
        submission.setGrade(savedGrade);
        submissionRepository.save(submission);

        return savedGrade;
    }

    @Override
    @Transactional
    public Answer gradeAnswer(Long answerId, Double score) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found with ID: " + answerId));

        answer.setScore(score);
        return answerRepository.save(answer);
    }

    @Override
    public Grade getGradeBySubmission(Long submissionId) {
        return gradeRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new RuntimeException("Grade not found for submission: " + submissionId));
    }
}
