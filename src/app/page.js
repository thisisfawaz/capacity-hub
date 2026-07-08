import Layout from "@/components/Layout";
import { Card } from "@/components/Card";
import styles from "./page.module.css";
import { FiTrendingUp, FiCheckCircle, FiUsers, FiAward } from "react-icons/fi";

export default function Dashboard() {
  const stats = [
    { label: "Overall Capacity Score", value: "72%", icon: <FiTrendingUp size={24} color="var(--primary-color)" /> },
    { label: "Assessments Completed", value: "4", icon: <FiCheckCircle size={24} color="var(--success-color)" /> },
    { label: "Learning Modules", value: "12", icon: <FiAward size={24} color="var(--warning-color)" /> },
    { label: "Team Members", value: "8", icon: <FiUsers size={24} color="var(--text-secondary)" /> },
  ];

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Welcome back, Global Health NGO</h1>
          <p className={styles.pageSubtitle}>Here's a summary of your organisation's capacity development progress.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Recommended Actions</h2>
      <div className={styles.grid}>
        <Card 
          title="Organisational Capacity Assessment" 
          badge="High Priority" 
          actionText="Start Assessment" 
          actionLink="/assessments"
        >
          <p>It's time for your annual baseline assessment. Evaluate your core competencies across governance, finance, and programs.</p>
        </Card>

        <Card 
          title="Introduction to NGO Governance" 
          badge="Learning" 
          badgeType="success"
          actionText="Continue Module" 
          actionLink="/learning"
        >
          <p>You have completed 45% of this module. Continue learning about board responsibilities and strategic oversight.</p>
        </Card>
        
        <Card 
          title="Strategic Planning Canvas" 
          badge="Tool" 
          actionText="Use Tool" 
          actionLink="/planning"
          outlineAction={true}
        >
          <p>Prepare for your upcoming strategy session with this collaborative one-page canvas.</p>
        </Card>
      </div>

      <div className={styles.twoCol}>
        <div>
          <h2 className={styles.sectionTitle}>Recent Templates</h2>
          <div className={styles.listGroup}>
            <div className={styles.listItem}>
              <div className={styles.itemIcon}>📄</div>
              <div>
                <strong>Project Budget Template</strong>
                <p>Financial Management</p>
              </div>
            </div>
            <div className={styles.listItem}>
              <div className={styles.itemIcon}>🛡️</div>
              <div>
                <strong>Safeguarding Policy</strong>
                <p>Human Resources</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className={styles.sectionTitle}>Funding Highlights</h2>
          <div className={styles.listGroup}>
            <div className={styles.listItem}>
              <div className={styles.itemIcon}>🌍</div>
              <div>
                <strong>Global Innovation Fund</strong>
                <p>$50K - $15M • Rolling Deadline</p>
              </div>
            </div>
            <div className={styles.listItem}>
              <div className={styles.itemIcon}>💡</div>
              <div>
                <strong>Africa Development Grants</strong>
                <p>Up to $100K • Oct 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
