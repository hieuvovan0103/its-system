import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '@/services/assessmentService';
import type { Assessment, Answer } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Award,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function TakeAssessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (id) loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      const data = await assessmentService.getById(Number(id));
      setAssessment(data);
    } catch (error) {
      console.error('Failed to load assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = assessment?.questions[currentQuestionIndex];
  const totalQuestions = assessment?.questions.length || 0;
  const answeredCount = answers.size;

  const handleAnswerChange = (questionId: number, content: string, selectedOptionIndex?: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, {
      questionId,
      content,
      selectedOptionIndex,
    });
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    const unansweredCount = totalQuestions - answeredCount;
    if (unansweredCount > 0) {
      if (!confirm(`You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`)) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await assessmentService.submitAssessment(assessment.id, Array.from(answers.values()));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <Card>
          <CardContent className="animate-pulse py-12">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment not found</h3>
          <Button onClick={() => navigate('/assessments')}>Back to Assessments</Button>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your answers have been submitted successfully. You will receive your results soon.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/assessments')}>
                Back to Assessments
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
                navigate('/assessments');
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{assessment.title}</h1>
            <div className="flex items-center gap-4 mt-1">
              <Badge
                variant={
                  assessment.type === 'QUIZ' ? 'info' :
                  assessment.type === 'EXAM' ? 'error' : 'primary'
                }
                size="sm"
              >
                {assessment.type}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Award className="w-4 h-4" />
                {assessment.totalScore} points
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-500">
              {answeredCount} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {assessment.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : answers.has(q.id)
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentQuestion && (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-between mb-6">
              <Badge variant="default">{currentQuestion.type}</Badge>
              <span className="text-sm font-medium text-gray-500">
                {currentQuestion.score} points
              </span>
            </div>

            <h2 className="text-xl font-medium text-gray-900 mb-6">
              {currentQuestion.text}
            </h2>

            {currentQuestion.type === 'MCQ' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers.get(currentQuestion.id)?.selectedOptionIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerChange(currentQuestion.id, '', index)}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                          isSelected
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`flex-1 ${isSelected ? 'text-primary-900 font-medium' : 'text-gray-700'}`}>
                          {option}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'ESSAY' && (
              <textarea
                value={answers.get(currentQuestion.id)?.content || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write your answer here..."
              />
            )}

            {currentQuestion.type === 'CODING' && (
              <textarea
                value={answers.get(currentQuestion.id)?.content || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="// Write your code here..."
              />
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
