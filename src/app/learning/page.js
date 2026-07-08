"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, Button } from "@/components/Card";
import styles from "../page.module.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from "next/link";
import { 
  FiArrowRight, FiArrowLeft, FiCheckCircle, FiClock, FiAward, 
  FiBookOpen, FiBarChart2, FiFileText, FiDownload, FiShare2, 
  FiPrinter, FiCheck, FiX, FiChevronRight, FiChevronLeft,
  FiBookmark, FiUser, FiCalendar, FiStar, FiTrendingUp
} from "react-icons/fi";
import learningData from "@/data/learning.json";

// ✅ HELPER FUNCTION: Convert **bold** to <strong>bold</strong>
const convertBoldToHTML = (text) => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

export default function LearningCentre() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const topics = learningData;

  const getTopic = (id) => topics.find(t => t.id === id);
  const getLessons = (id) => getTopic(id)?.lessons || [];
  const getQuiz = (id) => getTopic(id)?.quiz || [];
  const totalLessons = activeTopic ? getLessons(activeTopic).length : 0;
  const totalQuiz = activeTopic ? getQuiz(activeTopic).length : 0;

  const handleNextLesson = () => {
    if (currentLesson < totalLessons - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      if (totalQuiz > 0) {
        setShowQuiz(true);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizResult(null);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleQuizAnswer = (questionIdx, optionIdx) => {
    setQuizAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const submitQuiz = () => {
    const quiz = getQuiz(activeTopic);
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) {
        correct++;
      }
    });
    const score = Math.round((correct / quiz.length) * 100);
    setQuizResult({ correct, total: quiz.length, score });
    setQuizSubmitted(true);
  };

  const resetLearning = () => {
    setActiveTopic(null);
    setCurrentLesson(0);
    setIsCompleted(false);
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizSubmitted(false);
  };

  const getProgress = () => {
    return Math.round(((currentLesson + 1) / totalLessons) * 100);
  };

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Learning Centre</h1>
          <p className={styles.pageSubtitle}>
            Build your skills with comprehensive modules on governance, finance, and program design.
          </p>
        </div>
        {activeTopic && (
          <Button variant="outline" onClick={resetLearning}>
            <FiArrowLeft /> Back to Topics
          </Button>
        )}
      </div>

      {!activeTopic ? (
        <div className={styles.grid}>
          {topics.map(topic => (
            <div key={topic.id} className={styles.statCard} style={{ display: 'block', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{topic.id === 'lm-1' ? '🏛️' : topic.id === 'lm-2' ? '💰' : '📊'}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{topic.title}</h3>
                  </div>
                  <span style={{ 
                    padding: '2px 10px', 
                    borderRadius: '9999px', 
                    fontSize: '0.7rem', 
                    backgroundColor: topic.category === 'Governance' ? '#4f46e5' : topic.category === 'Finance' ? '#10b981' : '#8b5cf6',
                    color: 'white',
                    fontWeight: 500
                  }}>
                    {topic.category}
                  </span>
                </div>
                <span style={{ 
                  padding: '2px 10px', 
                  borderRadius: '9999px', 
                  fontSize: '0.7rem', 
                  backgroundColor: topic.level === 'Beginner' ? '#dbeafe' : '#fef3c7',
                  color: topic.level === 'Beginner' ? '#1d4ed8' : '#b45309',
                  fontWeight: 500
                }}>
                  {topic.level}
                </span>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {topic.description}
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>📚 {topic.lessons.length} modules</span>
                <span>⏱️ {topic.duration}</span>
                <span>📝 {topic.quiz.length} quiz questions</span>
              </div>
              
              <div style={{ 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '1rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  flexWrap: 'wrap',
                  flex: 1
                }}>
                  {topic.objectives.map((obj, i) => (
                    <span key={i} style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{ color: '#10b981' }}>✓</span> 
                      {obj.length > 30 ? obj.substring(0, 30) + '...' : obj}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setActiveTopic(topic.id);
                    setCurrentLesson(0);
                    setIsCompleted(false);
                    setShowQuiz(false);
                    setQuizAnswers({});
                    setQuizResult(null);
                    setQuizSubmitted(false);
                  }}
                  style={{ 
                    color: 'white',
                    backgroundColor: 'var(--primary-color)',
                    fontWeight: 500, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Start Learning <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : showQuiz ? (
        // Quiz View
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              📝 Quiz: {getTopic(activeTopic)?.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Test your knowledge with {totalQuiz} questions.
            </p>
          </div>

          {quizSubmitted && quizResult ? (
            <div>
              <div style={{
                padding: '2rem',
                borderRadius: '12px',
                backgroundColor: quizResult.score >= 70 ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${quizResult.score >= 70 ? '#10b981' : '#ef4444'}`,
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: quizResult.score >= 70 ? '#10b981' : '#ef4444' }}>
                  {quizResult.score}%
                </div>
                <div style={{ fontSize: '1.1rem' }}>
                  {quizResult.score >= 70 ? '🎉 Congratulations! You passed!' : '📚 Keep learning and try again!'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {quizResult.correct} out of {quizResult.total} correct
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Review Your Answers</h3>
                {getQuiz(activeTopic).map((q, idx) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '0.75rem',
                    backgroundColor: quizAnswers[idx] === q.answer ? '#ecfdf5' : '#fef2f2'
                  }}>
                    <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                      {idx + 1}. {q.question}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Your answer: {q.options[quizAnswers[idx]] || 'Not answered'}
                      {quizAnswers[idx] === q.answer ? ' ✅' : ' ❌'}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#10b981' }}>
                      Correct answer: {q.options[q.answer]}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={() => {
                  setShowQuiz(false);
                  setIsCompleted(true);
                }}>
                  View Certificate
                </Button>
                <Button variant="outline" onClick={resetLearning}>
                  Back to Topics
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {getQuiz(activeTopic).map((q, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '1rem' }}>
                    {idx + 1}. {q.question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {q.options.map((option, oi) => (
                      <div
                        key={oi}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          border: `2px solid ${quizAnswers[idx] === oi ? '#4f46e5' : 'var(--border-color)'}`,
                          backgroundColor: quizAnswers[idx] === oi ? '#eef2ff' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleQuizAnswer(idx, oi)}
                        onMouseEnter={(e) => {
                          if (quizAnswers[idx] !== oi) {
                            e.currentTarget.style.borderColor = 'var(--text-secondary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (quizAnswers[idx] !== oi) {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                          }
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: `2px solid ${quizAnswers[idx] === oi ? '#4f46e5' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          background: quizAnswers[idx] === oi ? '#4f46e5' : 'transparent',
                          color: 'white'
                        }}>
                          {quizAnswers[idx] === oi && <FiCheck size={14} />}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Button 
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length !== totalQuiz}
                >
                  Submit Quiz
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowQuiz(false);
                  setCurrentLesson(totalLessons - 1);
                }}>
                  Back to Lessons
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : isCompleted ? (
        // Completion View
        <div>
          <div style={{
            padding: '3rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
            color: 'white',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Congratulations!
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              You have completed all {totalLessons} modules of {getTopic(activeTopic)?.title}.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>📋 What You Learned</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {getTopic(activeTopic)?.objectives.map((obj, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{obj}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button onClick={() => {
              if (totalQuiz > 0) {
                setShowQuiz(true);
                setQuizAnswers({});
                setQuizSubmitted(false);
                setQuizResult(null);
              }
            }}>
              {totalQuiz > 0 ? 'Take the Quiz' : 'Download Certificate'}
            </Button>
            <Button variant="outline" onClick={resetLearning}>
              Explore Other Topics
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <FiPrinter /> Print Summary
            </Button>
          </div>
        </div>
      ) : (
        // Lesson View
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Module {currentLesson + 1} of {totalLessons}
                </span>
                <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
                  {getLessons(activeTopic)[currentLesson]?.title}
                </h2>
              </div>
              <span style={{ 
                padding: '2px 12px', 
                borderRadius: '9999px', 
                fontSize: '0.7rem', 
                backgroundColor: 'var(--bg-subtle)',
                fontWeight: 500
              }}>
                ⏱️ {getLessons(activeTopic)[currentLesson]?.duration}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Progress
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {getProgress()}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'var(--border-color)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getProgress()}%`,
                height: '100%',
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Lesson Content - WITH BOLD CONVERSION */}
          <div style={{
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            marginBottom: '2rem',
            minHeight: '400px',
            maxHeight: '500px',
            overflowY: 'auto',
          }}>
            {(() => {
              const content = getLessons(activeTopic)[currentLesson]?.content || '';
              const lines = content.split('\n').filter(line => line.trim() !== '');
              
              return lines.map((line, index) => {
                const trimmed = line.trim();
                const isListItem = /^[-*]/.test(trimmed) || /^\d+\./.test(trimmed);
                
                // ✅ CONVERT **bold** TO <strong>bold</strong>
                const htmlContent = convertBoldToHTML(trimmed);
                
                if (isListItem) {
                  const text = htmlContent.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
                  return (
                    <div key={index} style={{ 
                      paddingLeft: '1.5rem', 
                      marginBottom: '0.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span>•</span>
                      <span dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                  );
                }
                
                return (
                  <p 
                    key={index} 
                    style={{ 
                      marginBottom: '1rem', 
                      lineHeight: '1.8',
                      marginTop: 0
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                );
              });
            })()}
            
            {/* Key Points */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)'
            }}>
              <h4 style={{ marginBottom: '0.75rem' }}>📌 Key Points</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {getLessons(activeTopic)[currentLesson]?.keyPoints.map((point, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <Button 
              variant="outline" 
              onClick={handlePreviousLesson}
              disabled={currentLesson === 0}
            >
              <FiArrowLeft /> Previous
            </Button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" onClick={resetLearning}>
                Exit
              </Button>
              <Button onClick={handleNextLesson}>
                {currentLesson === totalLessons - 1 ? 'Complete Learning' : 'Next →'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}