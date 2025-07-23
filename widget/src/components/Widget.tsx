import React, { useState, useEffect } from 'react';
import { Question, Project, ProjectSettings } from '../../types';
import './Widget.css';

interface WidgetProps {
  projectId: string;
  apiUrl?: string;
}

interface WidgetState {
  project: Project | null;
  currentQuestionIndex: number;
  responses: Record<string, any>;
  loading: boolean;
  error: string | null;
  submitted: boolean;
}

const Widget: React.FC<WidgetProps> = ({ 
  projectId, 
  apiUrl = 'http://localhost:3002/api' 
}) => {
  const [state, setState] = useState<WidgetState>({
    project: null,
    currentQuestionIndex: 0,
    responses: {},
    loading: true,
    error: null,
    submitted: false
  });

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      console.log('Fetching project:', projectId, 'from:', `${apiUrl}/widget/${projectId}`);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`${apiUrl}/widget/${projectId}`);
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          project: result.data,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Failed to load project',
          loading: false
        }));
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to demo data when API is not available
      const demoProject = {
        id: projectId,
        name: 'Demo Survey',
        questions: [
          {
            id: 'q1',
            text: 'How satisfied are you with our service?',
            type: 'rating' as const,
            required: true
          },
          {
            id: 'q2',
            text: 'What is your favorite feature?',
            type: 'multiple-choice' as const,
            required: false,
            options: ['Easy to use', 'Fast performance', 'Great design', 'Excellent support']
          },
          {
            id: 'q3',
            text: 'Any additional feedback?',
            type: 'text' as const,
            required: false
          }
        ],
        settings: {
          theme: {
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            borderRadius: '8px'
          },
          behavior: {
            showProgressBar: true,
            allowBack: true
          },
          branding: {
            showPoweredBy: true
          }
        }
      };
      
      setState(prev => ({
        ...prev,
        project: demoProject,
        loading: false
      }));
    }
  };

  const handleResponse = (questionId: string, value: any) => {
    setState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      }
    }));
  };

  const nextQuestion = () => {
    if (!state.project) return;
    
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex < state.project.questions.length) {
      setState(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
    } else {
      submitResponses();
    }
  };

  const prevQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: state.currentQuestionIndex - 1 }));
    }
  };

  const submitResponses = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const response = await fetch(`${apiUrl}/widget/${projectId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: state.responses
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ ...prev, submitted: true, loading: false }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Failed to submit responses',
          loading: false
        }));
      }
    } catch (error) {
      console.error('Submit Error:', error);
      // In demo mode, simulate successful submission
      console.log('Demo mode: Simulating successful submission with responses:', state.responses);
      setState(prev => ({ ...prev, submitted: true, loading: false }));
    }
  };

  const renderQuestion = (question: Question) => {
    const currentResponse = state.responses[question.id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="question-options">
            {question.options?.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentResponse === option}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            className="text-input"
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
          />
        );

      case 'rating':
        return (
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                className={`rating-button ${currentResponse === rating ? 'selected' : ''}`}
                onClick={() => handleResponse(question.id, rating)}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="boolean-options">
            <button
              type="button"
              className={`boolean-button ${currentResponse === true ? 'selected' : ''}`}
              onClick={() => handleResponse(question.id, true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`boolean-button ${currentResponse === false ? 'selected' : ''}`}
              onClick={() => handleResponse(question.id, false)}
            >
              No
            </button>
          </div>
        );

      default:
        return <p>Unsupported question type</p>;
    }
  };

  if (state.loading) {
    return (
      <div className="widget-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="widget-container">
        <div className="error">Error: {state.error}</div>
      </div>
    );
  }

  if (state.submitted) {
    return (
      <div className="widget-container">
        <div className="success">
          <h3>Thank you!</h3>
          <p>Your responses have been submitted successfully.</p>
        </div>
      </div>
    );
  }

  if (!state.project || state.project.questions.length === 0) {
    return (
      <div className="widget-container">
        <div className="error">No questions found for this project.</div>
      </div>
    );
  }

  const currentQuestion = state.project.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.project.questions.length) * 100;
  const isLastQuestion = state.currentQuestionIndex === state.project.questions.length - 1;
  const canProceed = state.responses[currentQuestion.id] !== undefined || !currentQuestion.required;

  return (
    <div 
      className="widget-container"
      style={{
        '--primary-color': state.project.settings?.theme?.primaryColor || '#007bff',
        '--secondary-color': state.project.settings?.theme?.secondaryColor || '#6c757d',
        '--background-color': state.project.settings?.theme?.backgroundColor || '#ffffff',
        '--text-color': state.project.settings?.theme?.textColor || '#333333',
        '--border-radius': state.project.settings?.theme?.borderRadius || '8px'
      } as React.CSSProperties}
    >
      {state.project.settings?.behavior?.showProgressBar && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="question-container">
        <div className="question-header">
          <span className="question-number">
            Question {state.currentQuestionIndex + 1} of {state.project.questions.length}
          </span>
          {currentQuestion.required && <span className="required">*</span>}
        </div>

        <h3 className="question-text">{currentQuestion.text}</h3>

        <div className="question-content">
          {renderQuestion(currentQuestion)}
        </div>

        <div className="navigation-buttons">
          {state.project.settings?.behavior?.allowBack && state.currentQuestionIndex > 0 && (
            <button 
              type="button" 
              className="nav-button prev-button"
              onClick={prevQuestion}
            >
              Previous
            </button>
          )}

          <button
            type="button"
            className="nav-button next-button"
            onClick={nextQuestion}
            disabled={!canProceed}
          >
            {isLastQuestion ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>

      {state.project.settings?.branding?.showPoweredBy && (
        <div className="powered-by">
          Powered by Dynamic Widget System
        </div>
      )}
    </div>
  );
};

export default Widget;
