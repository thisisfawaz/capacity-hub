"use client";

import Layout from "@/components/Layout";
import { Card, Button } from "@/components/Card";
import assessmentsData from "@/data/assessments.json";
import styles from "../page.module.css";
import Link from "next/link";
import { useState } from "react";
import { 
  FiArrowRight, FiCheckCircle, FiClock, FiAward, FiTrendingUp, 
  FiBarChart2, FiFileText, FiDownload, FiShare2, FiPrinter,
  FiArrowLeft, FiCheck, FiX
} from "react-icons/fi";

export default function AssessmentCentre() {
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const assessments = assessmentsData.assessments;

  const getAssessment = (id) => assessments.find(a => a.id === id);
  const getQuestions = (id) => getAssessment(id)?.questions || [];
  const totalQuestions = activeAssessment ? getQuestions(activeAssessment).length : 0;

  const handleSelectAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateEvaluation();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / totalQuestions) * 100);
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] !== undefined;
  };

  // ============================================================
  // AI EVALUATION GENERATION
  // ============================================================

  const generateEvaluation = async () => {
    setIsGenerating(true);
    
    try {
      const assessment = getAssessment(activeAssessment);
      const questions = getQuestions(activeAssessment);
      
      const answeredQuestions = questions.map(q => ({
        question: q.question,
        category: q.category,
        answer: answers[q.id] || "Not answered"
      }));

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentType: assessment.title,
          assessmentId: activeAssessment,
          answers: answeredQuestions,
          totalQuestions: questions.length,
          answeredCount: Object.keys(answers).length
        })
      });

      const data = await response.json();
      
      setEvaluation({
        summary: data.summary || generateFallbackEvaluation(answeredQuestions).summary,
        strengths: data.strengths || generateFallbackEvaluation(answeredQuestions).strengths,
        weaknesses: data.weaknesses || generateFallbackEvaluation(answeredQuestions).weaknesses,
        recommendations: data.recommendations || generateFallbackEvaluation(answeredQuestions).recommendations,
        score: data.score || generateFallbackEvaluation(answeredQuestions).score,
        detailedBreakdown: data.detailedBreakdown || generateFallbackEvaluation(answeredQuestions).detailedBreakdown,
        categories: data.categories || generateFallbackEvaluation(answeredQuestions).categories
      });
      
      setIsComplete(true);
      setShowResults(true);
    } catch (error) {
      console.error("Error generating evaluation:", error);
      const assessment = getAssessment(activeAssessment);
      const questions = getQuestions(activeAssessment);
      const answeredQuestions = questions.map(q => ({
        question: q.question,
        category: q.category,
        answer: answers[q.id] || "Not answered"
      }));
      
      setEvaluation(generateFallbackEvaluation(answeredQuestions));
      setIsComplete(true);
      setShowResults(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // ============================================================
  // FALLBACK EVALUATION GENERATORS
  // ============================================================

  const calculateScore = (answeredQuestions) => {
    const answered = answeredQuestions.filter(q => q.answer !== "Not answered");
    return Math.round((answered.length / answeredQuestions.length) * 100);
  };

  const generateCategoryBreakdown = (answeredQuestions) => {
    const categories = {};
    answeredQuestions.forEach(q => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, answered: 0 };
      }
      categories[q.category].total++;
      if (q.answer !== "Not answered") {
        categories[q.category].answered++;
      }
    });
    return Object.entries(categories).map(([name, data]) => ({
      name,
      score: Math.round((data.answered / data.total) * 100)
    }));
  };

  const generateDetailedBreakdown = (answeredQuestions) => {
    return answeredQuestions.map(q => ({
      question: q.question,
      answer: q.answer,
      status: q.answer !== "Not answered" ? "Completed" : "Incomplete",
      category: q.category
    }));
  };

  const generateFallbackEvaluation = (answeredQuestions) => {
    const score = calculateScore(answeredQuestions);
    const categoryBreakdown = generateCategoryBreakdown(answeredQuestions);
    const detailedBreakdown = generateDetailedBreakdown(answeredQuestions);
    
    let summary = "";
    let strengths = [];
    let weaknesses = [];
    let recommendations = [];

    if (score >= 80) {
      summary = "Your organization demonstrates strong readiness with solid systems in place. You are well-positioned for project implementation and funding opportunities.";
      strengths = [
        "Strong organizational structure",
        "Good financial management systems",
        "Clear project design",
        "Effective partnerships"
      ];
      weaknesses = [
        "Consider expanding monitoring and evaluation",
        "Could strengthen sustainability planning"
      ];
      recommendations = [
        "Continue building on your strengths",
        "Consider expanding partnerships",
        "Explore larger funding opportunities"
      ];
    } else if (score >= 50) {
      summary = "Your organization has a good foundation but there are areas that need strengthening before pursuing major funding.";
      strengths = [
        "Commitment to mission",
        "Some organizational structures in place",
        "Relevant experience"
      ];
      weaknesses = [
        "Limited formal policies",
        "Need stronger financial systems",
        "Need more partnerships"
      ];
      recommendations = [
        "Develop formal policies and procedures",
        "Build your monitoring and evaluation system",
        "Seek partnerships in your sector"
      ];
    } else {
      summary = "Your organization needs significant capacity strengthening to prepare for successful project implementation and funding.";
      strengths = [
        "Passion and commitment",
        "Community connections",
        "Willingness to learn"
      ];
      weaknesses = [
        "Limited organizational structure",
        "No formal policies",
        "Limited experience"
      ];
      recommendations = [
        "Focus on organizational development first",
        "Seek capacity building support",
        "Start with smaller grants or partnerships"
      ];
    }

    return {
      summary,
      strengths,
      weaknesses,
      recommendations,
      score,
      detailedBreakdown,
      categories: categoryBreakdown
    };
  };

  // ============================================================
  // RENDER: RESULTS VIEW
  // ============================================================

  const renderResults = () => {
    if (!evaluation) return null;

    return (
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FiAward color="#4f46e5" /> Assessment Results
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="outline"><FiDownload /> Download Report</Button>
            <Button variant="outline"><FiPrinter /> Print</Button>
            <Button variant="outline" onClick={() => {
              setIsComplete(false);
              setShowResults(false);
              setEvaluation(null);
              setCurrentQuestion(0);
              setAnswers({});
              setActiveAssessment(null);
            }}>Start Over</Button>
          </div>
        </div>

        {/* Score Overview */}
        <div style={{
          padding: '2rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
          color: 'white',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Overall Score</div>
          <div style={{ fontSize: '4rem', fontWeight: 700 }}>{evaluation.score}%</div>
          <div style={{ fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            {evaluation.summary}
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>📊 Category Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {evaluation.categories.map((cat, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cat.name}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: cat.score >= 80 ? '#10b981' : cat.score >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {cat.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            padding: '1.5rem',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>💪 Strengths</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div style={{
            padding: '1.5rem',
            borderRadius: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #ef4444'
          }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Areas for Improvement</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#b45309', marginBottom: '1rem' }}>💡 Recommendations</h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#92400e' }}>
            {evaluation.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        {/* Detailed Breakdown */}
        <details style={{
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          cursor: 'pointer'
        }}>
          <summary style={{ fontWeight: 600, fontSize: '1.1rem' }}>
            📋 View Detailed Question Breakdown
          </summary>
          <div style={{ marginTop: '1rem' }}>
            {evaluation.detailedBreakdown.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0',
                borderBottom: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.9rem', flex: 1 }}>{item.question}</span>
                <span style={{
                  padding: '0.15rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: item.status === 'Completed' ? '#ecfdf5' : '#fef2f2',
                  color: item.status === 'Completed' ? '#10b981' : '#ef4444'
                }}>
                  {item.status} {item.answer !== "Not answered" ? `→ ${item.answer}` : ''}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>
    );
  };

  // ============================================================
  // RENDER: QUESTION VIEW
  // ============================================================

  const renderQuestion = () => {
    const questions = getQuestions(activeAssessment);
    const question = questions[currentQuestion];
    const progress = getProgress();

    return (
      <div>
        {/* Back Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Button variant="outline" onClick={() => {
            if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
              setActiveAssessment(null);
              setCurrentQuestion(0);
              setAnswers({});
            }
          }}>
            <FiArrowLeft /> Back to Assessments
          </Button>
        </div>

        {/* Assessment Title */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          {getAssessment(activeAssessment)?.title}
        </h2>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {progress}% Complete
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'var(--border-color)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Question */}
        <div style={{
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '0.5rem',
            fontWeight: 500
          }}>
            {question.category}
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            {question.question}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {question.options.map((option, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `2px solid ${answers[question.id] === option ? '#4f46e5' : 'var(--border-color)'}`,
                  backgroundColor: answers[question.id] === option ? '#eef2ff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleSelectAnswer(question.id, option)}
                onMouseEnter={(e) => {
                  if (answers[question.id] !== option) {
                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (answers[question.id] !== option) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${answers[question.id] === option ? '#4f46e5' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: answers[question.id] === option ? '#4f46e5' : 'transparent',
                  color: 'white'
                }}>
                  {answers[question.id] === option && <FiCheck size={14} />}
                </div>
                <span style={{ fontSize: '0.95rem' }}>{option}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <FiArrowLeft /> Previous
          </Button>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button 
              onClick={handleNext}
              disabled={!isQuestionAnswered(question.id)}
            >
              {currentQuestion === totalQuestions - 1 ? (
                isGenerating ? 'Generating Results...' : 'Submit & Get Results'
              ) : (
                'Next →'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER: MAIN
  // ============================================================

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Assessment Centre</h1>
          <p className={styles.pageSubtitle}>Evaluate your organisational capacity and identify areas for growth.</p>
        </div>
      </div>

      {!activeAssessment ? (
        <div className={styles.grid}>
          {assessments.map(assessment => (
            <div key={assessment.id} className={styles.statCard} style={{ display: 'block', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{assessment.icon}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{assessment.title}</h3>
                </div>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  backgroundColor: assessment.color || 'var(--bg-subtle)',
                  color: 'white',
                  fontWeight: 500
                }}>
                  {assessment.questions.length} questions
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '60px' }}>
                {assessment.description}
              </p>
              <div style={{ 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '1rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  ⏱️ {assessment.timeEstimate || '15-20 min'}
                </span>
                <button 
                  onClick={() => {
                    setActiveAssessment(assessment.id);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setIsComplete(false);
                    setShowResults(false);
                    setEvaluation(null);
                  }}
                  style={{ 
                    color: 'var(--primary-color)', 
                    fontWeight: 500, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Start Assessment <FiArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : showResults ? (
        renderResults()
      ) : (
        renderQuestion()
      )}
    </Layout>
  );
}