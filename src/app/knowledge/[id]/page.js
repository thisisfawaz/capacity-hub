"use client";

import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import knowledgeData from "@/data/knowledge.json";
import styles from "../../page.module.css";
import Link from "next/link";
import { FiArrowLeft, FiClock, FiUser, FiCalendar } from "react-icons/fi";

export default function KnowledgeArticle() {
  const params = useParams();
  const id = params.id;
  
  // Find the article
  const article = knowledgeData.find(a => a.id === id);

  // If article not found
  if (!article) {
    return (
      <Layout>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Article Not Found</h1>
            <p className={styles.pageSubtitle}>The article you're looking for doesn't exist.</p>
          </div>
        </div>
        <Link href="/knowledge" style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>
          <FiArrowLeft /> Back to Knowledge Centre
        </Link>
      </Layout>
    );
  }

  // Format content with proper paragraphs
  const formatContent = (content) => {
    if (!content) return null;
    
    // Split by double newlines for paragraphs
    const blocks = content.split('\n\n').filter(b => b.trim() !== '');
    
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      
      // === HEADINGS ===
      if (trimmed.startsWith('#')) {
        const level = trimmed.match(/^#+/)[0].length;
        const text = trimmed.replace(/^#+\s*/, '');
        const fontSize = level === 1 ? '1.8rem' : '1.3rem';
        const fontWeight = level === 1 ? 700 : 600;
        return (
          <h2 key={idx} style={{ 
            fontSize: fontSize,
            fontWeight: fontWeight,
            marginTop: '2rem',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            {text}
          </h2>
        );
      }
      
      // === BOLD HEADINGS (starts with ** and no newline) ===
      if (trimmed.startsWith('**') && !trimmed.includes('\n') && trimmed.endsWith('**')) {
        return (
          <h3 key={idx} style={{ 
            fontSize: '1.1rem',
            fontWeight: 600,
            marginTop: '1.5rem',
            marginBottom: '0.75rem',
            color: 'var(--text-primary)'
          }}>
            {trimmed.replace(/\*\*/g, '')}
          </h3>
        );
      }
      
      // === BULLET LISTS (lines starting with - or *) ===
      if (trimmed.includes('\n') && (trimmed.includes('- ') || trimmed.includes('* '))) {
        const lines = trimmed.split('\n').filter(l => l.trim() !== '');
        return (
          <ul key={idx} style={{ 
            marginBottom: '1rem',
            paddingLeft: '1.5rem',
            listStyle: 'none',
            color: 'var(--text-secondary)'
          }}>
            {lines.map((line, i) => {
              const text = line.replace(/^[-*]\s*/, '');
              const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return (
                <li key={i} style={{ 
                  marginBottom: '0.4rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: 'var(--primary-color)' }}>•</span>
                  <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                </li>
              );
            })}
          </ul>
        );
      }
      
      // === NUMBERED LISTS (lines starting with 1., 2., etc.) ===
      if (trimmed.includes('\n') && /^\d+\./.test(trimmed)) {
        const lines = trimmed.split('\n').filter(l => l.trim() !== '');
        return (
          <ol key={idx} style={{ 
            marginBottom: '1rem',
            paddingLeft: '1.5rem',
            color: 'var(--text-secondary)'
          }}>
            {lines.map((line, i) => {
              const text = line.replace(/^\d+\.\s*/, '');
              const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return (
                <li key={i} style={{ marginBottom: '0.4rem' }}>
                  <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                </li>
              );
            })}
          </ol>
        );
      }
      
      // === INLINE BULLET LIST (single line with multiple items separated by dashes) ===
      if (trimmed.includes(' - ') || trimmed.includes('- ')) {
        const items = trimmed.split(/\s*-\s*/).filter(item => item.trim() !== '');
        return (
          <ul key={idx} style={{ 
            marginBottom: '1rem',
            paddingLeft: '1.5rem',
            listStyle: 'none',
            color: 'var(--text-secondary)'
          }}>
            {items.map((item, i) => {
              const formattedText = item.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return (
                <li key={i} style={{ 
                  marginBottom: '0.4rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: 'var(--primary-color)' }}>•</span>
                  <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                </li>
              );
            })}
          </ul>
        );
      }
      
      // === REGULAR PARAGRAPH ===
      const formattedParagraph = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return (
        <p 
          key={idx} 
          style={{ 
            marginBottom: '1rem', 
            lineHeight: '1.8',
            fontSize: '1rem',
            color: 'var(--text-secondary)'
          }}
          dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        />
      );
    });
  };

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/knowledge" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--primary-color)', 
            fontWeight: 500, 
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            <FiArrowLeft /> Back to Knowledge Centre
          </Link>
          <h1 className={styles.pageTitle} style={{ fontSize: '2.2rem' }}>
            {article.title}
          </h1>
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)',
            marginTop: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiUser size={16} /> {article.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiCalendar size={16} /> {article.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiClock size={16} /> {article.readTime}
            </span>
            <span style={{ 
              display: 'inline-flex',
              background: 'var(--bg-subtle)',
              padding: '0.15rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: 'var(--primary-color)',
              fontWeight: 500
            }}>
              {article.category}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div style={{
        maxWidth: '750px',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        backgroundColor: '#ffffff',
        marginBottom: '2rem'
      }}>
        {formatContent(article.content)}
      </div>

      {/* Back to Knowledge Centre */}
      <Link href="/knowledge" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: 'var(--primary-color)', 
        fontWeight: 500, 
        textDecoration: 'none',
        fontSize: '0.9rem'
      }}>
        <FiArrowLeft /> Back to Knowledge Centre
      </Link>
    </Layout>
  );
}