"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import learningData from "@/data/learning.json";
import styles from "../../page.module.css";
import { Button } from "@/components/Card";
import { use } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function LearningModule({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const module = learningData.find(m => m.id === id);
  
  const [activeTab, setActiveTab] = useState("overview"); // overview, lessons, quiz

  if (!module) {
    return <Layout><h1>Module not found</h1></Layout>;
  }

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{module.title}</h1>
          <p className={styles.pageSubtitle}>{module.category} • {module.duration} • {module.level}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div className={styles.statCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
            <button 
              onClick={() => setActiveTab("overview")}
              style={{ padding: '0.75rem', textAlign: 'left', borderRadius: '8px', background: activeTab === 'overview' ? 'var(--bg-subtle)' : 'transparent', border: 'none', fontWeight: activeTab === 'overview' ? 600 : 400, color: activeTab === 'overview' ? 'var(--primary-color)' : 'var(--text-primary)', cursor: 'pointer' }}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("lessons")}
              style={{ padding: '0.75rem', textAlign: 'left', borderRadius: '8px', background: activeTab === 'lessons' ? 'var(--bg-subtle)' : 'transparent', border: 'none', fontWeight: activeTab === 'lessons' ? 600 : 400, color: activeTab === 'lessons' ? 'var(--primary-color)' : 'var(--text-primary)', cursor: 'pointer' }}
            >
              Lessons ({module.lessons ? module.lessons.length : 0})
            </button>
            <button 
              onClick={() => setActiveTab("quiz")}
              style={{ padding: '0.75rem', textAlign: 'left', borderRadius: '8px', background: activeTab === 'quiz' ? 'var(--bg-subtle)' : 'transparent', border: 'none', fontWeight: activeTab === 'quiz' ? 600 : 400, color: activeTab === 'quiz' ? 'var(--primary-color)' : 'var(--text-primary)', cursor: 'pointer' }}
            >
              Knowledge Quiz
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className={styles.statCard} style={{ display: 'block', padding: '2rem', minHeight: '400px' }}>
            
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ marginBottom: '1rem' }}>About this module</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{module.description}</p>
                
                <h3 style={{ marginBottom: '1rem' }}>Learning Objectives</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {module.objectives && module.objectives.map((obj, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <FiCheckCircle color="var(--success-color)" /> {obj}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '2rem' }}>
                  <Button onClick={() => setActiveTab('lessons')}>Start Learning</Button>
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div>
                {module.lessons && module.lessons.length > 0 ? (
                  <div>
                    {module.lessons.map((lesson, i) => (
                      <div key={i} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>{i+1}. {lesson.title}</h2>
                        <p style={{ lineHeight: '1.8' }}>{lesson.content}</p>
                      </div>
                    ))}
                    <Button onClick={() => setActiveTab('quiz')}>Take the Quiz</Button>
                  </div>
                ) : (
                  <p>No lessons available for this module yet.</p>
                )}
              </div>
            )}

            {activeTab === 'quiz' && (
              <div>
                <h2 style={{ marginBottom: '1rem' }}>Knowledge Check</h2>
                {module.quiz && module.quiz.length > 0 ? (
                  <div>
                    {module.quiz.map((q, i) => (
                      <div key={i} style={{ marginBottom: '2rem' }}>
                        <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{q.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}>
                              <input type="radio" name={`q-${i}`} value={optIdx} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button>Submit Quiz</Button>
                  </div>
                ) : (
                  <p>No quiz available for this module yet.</p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
