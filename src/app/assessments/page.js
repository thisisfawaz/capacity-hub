import Layout from "@/components/Layout";
import { Card } from "@/components/Card";
import assessmentsData from "@/data/assessments.json";
import styles from "../page.module.css";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function AssessmentCentre() {
  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Assessment Centre</h1>
          <p className={styles.pageSubtitle}>Evaluate your organisational capacity and identify areas for growth.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {assessmentsData.map(assessment => (
          <div key={assessment.id} className={styles.statCard} style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{assessment.title}</h3>
              <span style={{ padding: '4px 8px', borderRadius: '9999px', fontSize: '0.75rem', backgroundColor: 'var(--bg-subtle)' }}>
                {assessment.category}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '60px' }}>
              {assessment.description}
            </p>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{assessment.questions.length} questions</span>
              <Link href={`/assessments/${assessment.id}`} style={{ color: 'var(--primary-color)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Start Assessment <FiArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
