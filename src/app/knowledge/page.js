import Layout from "@/components/Layout";
import knowledgeData from "@/data/knowledge.json";
import styles from "../page.module.css";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

export default function KnowledgeCentre() {
  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Knowledge Centre</h1>
          <p className={styles.pageSubtitle}>Explore articles, guides, and best practices in NGO capacity development.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px' }}>
        {knowledgeData.map(article => (
          <div key={article.id} className={styles.statCard} style={{ display: 'block', padding: '2rem' }}>
            <span style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{article.category}</span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              <Link href={`/knowledge/${article.id}`}>{article.title}</Link>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <span>{article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {article.content}
            </p>
            <Link href={`/knowledge/${article.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 500 }}>
              <FiBookOpen /> Read Full Article
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
