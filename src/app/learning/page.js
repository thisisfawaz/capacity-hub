import Layout from "@/components/Layout";
import { Card } from "@/components/Card";
import learningData from "@/data/learning.json";
import styles from "../page.module.css";
import Link from "next/link";
import { FiClock, FiBarChart } from "react-icons/fi";

export default function LearningCentre() {
  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Learning Centre</h1>
          <p className={styles.pageSubtitle}>Access modules and resources to build your organisational knowledge.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {learningData.map(module => (
          <Card key={module.id} title={module.title} badge={module.category} actionText="Start Module" actionLink={`/learning/${module.id}`}>
            <p style={{ marginBottom: '1rem', minHeight: '60px' }}>{module.description}</p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiClock /> {module.duration}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiBarChart /> {module.level}</span>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
