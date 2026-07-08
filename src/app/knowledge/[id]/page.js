"use client";

import Layout from "@/components/Layout";
import knowledgeData from "@/data/knowledge.json";
import styles from "../../page.module.css";
import { Button } from "@/components/Card";
import { use } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function ArticlePage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const article = knowledgeData.find(a => a.id === id);

  if (!article) {
    return <Layout><h1>Article not found</h1><Link href="/knowledge">Back to Knowledge Centre</Link></Layout>;
  }

  return (
    <Layout>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/knowledge" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiArrowLeft /> Back to Articles
        </Link>
      </div>
      
      <div className={styles.statCard} style={{ display: 'block', padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <span style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>{article.category}</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>
          {article.title}
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <span>By {article.author}</span>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)' }}>
          {article.content}
          
          <p style={{ marginTop: '2rem' }}>
            <em>[This is a placeholder for the full article content in the MVP.]</em>
          </p>
        </div>
      </div>
    </Layout>
  );
}
