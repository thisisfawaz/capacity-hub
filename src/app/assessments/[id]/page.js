"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import assessmentsData from "@/data/assessments.json";
import styles from "../../page.module.css";
import { Button } from "@/components/Card";
import { use } from "react";

export default function AssessmentEngine({ params }) {
  // In Next 15, params is a promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const assessment = assessmentsData.find(a => a.id === id);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  if (!assessment) {
    return <Layout><h1>Assessment not found</h1></Layout>;
  }

  const handleOptionSelect = (score) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: score
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isComplete) {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = assessment.questions.length * 3;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return (
      <Layout>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>{assessment.title} - Results</h1>
            <p className={styles.pageSubtitle}>You have completed the assessment.</p>
          </div>
        </div>
        <div className={styles.statCard} style={{ display: 'block', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: '2rem 0' }}>
            {percentage}%
          </div>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            {percentage >= 80 ? "Excellent Capacity" : percentage >= 50 ? "Developing Capacity" : "Needs Significant Improvement"}
          </p>
          <Button onClick={() => window.location.href = '/assessments'}>Back to Assessments</Button>
        </div>
      </Layout>
    );
  }

  const question = assessment.questions[currentQuestionIndex];
  const progress = Math.round((currentQuestionIndex / assessment.questions.length) * 100);

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{assessment.title}</h1>
          <p className={styles.pageSubtitle}>Question {currentQuestionIndex + 1} of {assessment.questions.length}</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginBottom: '2rem' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
        </div>

        <div className={styles.statCard} style={{ display: 'block', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{question.text}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {question.options.map((option, idx) => {
              const isSelected = answers[currentQuestionIndex] === option.score;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option.score)}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'var(--bg-subtle)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
            <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={answers[currentQuestionIndex] === undefined}
            >
              {currentQuestionIndex === assessment.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
