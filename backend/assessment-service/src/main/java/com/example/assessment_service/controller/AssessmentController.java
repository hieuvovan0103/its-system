package com.example.assessment_service.controller;

import com.example.assessment_service.application.service.IAssessmentService;
import com.example.assessment_service.domain.entity.*;
import com.example.assessment_service.dto.*;
import com.example.assessment_service.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final IAssessmentService assessmentService;
    private final JwtUtils jwtUtils;

    @GetMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    public ResponseEntity<List<AssessmentDTO>> getAll() {
        List<Assessment> assessments = assessmentService.getAllAssessments();
        List<AssessmentDTO> dtos = assessments.stream()
                .map(this::mapToAssessmentDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    public ResponseEntity<AssessmentDTO> getById(@PathVariable Long id) {
        Assessment assessment = assessmentService.getAssessmentById(id);
        return ResponseEntity.ok(mapToAssessmentDTO(assessment));
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<AssessmentDTO> create(@RequestBody AssessmentDTO dto) {
        Assessment assessment = new Assessment();
        assessment.setTitle(dto.getTitle());
        assessment.setDescription(dto.getDescription());
        assessment.setType(dto.getType());
        assessment.setCourseId(dto.getCourseId());
        assessment.setDueDate(dto.getDueDate());

        Assessment saved = assessmentService.createAssessment(assessment);
        return ResponseEntity.ok(mapToAssessmentDTO(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<AssessmentDTO> update(@PathVariable Long id, @RequestBody AssessmentDTO dto) {
        Assessment assessment = new Assessment();
        assessment.setTitle(dto.getTitle());
        assessment.setDescription(dto.getDescription());
        assessment.setType(dto.getType());
        assessment.setCourseId(dto.getCourseId());
        assessment.setDueDate(dto.getDueDate());

        Assessment updated = assessmentService.updateAssessment(id, assessment);
        return ResponseEntity.ok(mapToAssessmentDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/questions")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<QuestionDTO> addQuestion(@PathVariable Long id, @RequestBody QuestionDTO dto) {
        Question question = new Question();
        question.setText(dto.getText());
        question.setType(dto.getType());
        question.setScore(dto.getScore());
        question.setOptions(dto.getOptions());
        question.setCorrectOptionIndex(dto.getCorrectOptionIndex());
        question.setMaxLengthAnswer(dto.getMaxLengthAnswer());
        question.setRubric(dto.getRubric());

        Question saved = assessmentService.addQuestion(id, question);
        dto.setId(saved.getId());
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{assessmentId}/questions/{questionId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long assessmentId, @PathVariable Long questionId) {
        assessmentService.deleteQuestion(assessmentId, questionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<GradeDTO> submit(
            @PathVariable Long id,
            @RequestBody SubmissionDTO submissionDto,
            @RequestHeader("Authorization") String token) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("CONTROLLER PASSED SECURITY! User: " + auth.getName() + " | Auth: " + auth.getAuthorities());

        Long studentId = 3L;

        Submission submission = new Submission();
        submission.setAssessmentId(id);
        submission.setStudentId(studentId);

        if (submissionDto.getAnswers() != null) {
            for (AnswerDTO ansDto : submissionDto.getAnswers()) {
                Answer answer = new Answer();
                answer.setQuestionId(ansDto.getQuestionId());
                answer.setContent(ansDto.getContent());
                answer.setSelectedOptionIndex(ansDto.getSelectedOptionIndex());
                submission.addAnswer(answer);
            }
        }

        Submission savedSubmission = assessmentService.submitAssessment(submission);

        Grade grade = assessmentService.gradeSubmission(
                savedSubmission.getId(),
                "System",
                "Auto-graded via API"
        );

        return ResponseEntity.ok(mapToGradeDTO(grade));
    }

    private AssessmentDTO mapToAssessmentDTO(Assessment entity) {
        AssessmentDTO dto = new AssessmentDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setType(entity.getType());
        dto.setCourseId(entity.getCourseId());
        dto.setTotalScore(entity.getTotalScore());
        dto.setDueDate(entity.getDueDate());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getQuestions() != null) {
            List<QuestionDTO> qDtos = entity.getQuestions().stream().map(q -> {
                QuestionDTO qDto = new QuestionDTO();
                qDto.setId(q.getId());
                qDto.setText(q.getText());
                qDto.setType(q.getType());
                qDto.setScore(q.getScore());
                qDto.setOptions(q.getOptions());
                qDto.setCorrectOptionIndex(q.getCorrectOptionIndex());
                qDto.setMaxLengthAnswer(q.getMaxLengthAnswer());
                qDto.setRubric(q.getRubric());
                return qDto;
            }).collect(Collectors.toList());
            dto.setQuestions(qDtos);
        }
        return dto;
    }

    private GradeDTO mapToGradeDTO(Grade entity) {
        GradeDTO dto = new GradeDTO();
        dto.setId(entity.getId());
        dto.setSubmissionId(entity.getSubmission().getId());
        dto.setTotalScore(entity.getTotalScore());
        dto.setMaxScore(entity.getMaxScore());
        dto.setGradedBy(entity.getGradedBy());
        dto.setFeedback(entity.getFeedback());
        dto.setGradedAt(entity.getGradedAt());
        dto.setPercentage(entity.getPercentage());
        dto.setLetterGrade(entity.getLetterGrade());
        return dto;
    }
}