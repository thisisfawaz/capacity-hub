"use client";

import Layout from "@/components/Layout";
import templatesData from "@/data/templates.json";
import styles from "../../page.module.css";
import { Button } from "@/components/Card";
import { use } from "react";
import Link from "next/link";
import { FiArrowLeft, FiDownload, FiFileText } from "react-icons/fi";

export default function TemplatePage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const template = templatesData.find(t => t.id === id);

  if (!template) {
    return <Layout><h1>Template not found</h1><Link href="/templates">Back to Templates</Link></Layout>;
  }

  return (
    <Layout>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/templates" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiArrowLeft /> Back to Templates
        </Link>
      </div>
      
      <div className={styles.statCard} style={{ display: 'block', padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '50%', color: 'var(--primary-color)', fontSize: '3rem', marginBottom: '1.5rem' }}>
          <FiFileText />
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {template.title}
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span style={{ padding: '4px 12px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', fontSize: '0.875rem' }}>{template.category}</span>
          <span style={{ padding: '4px 12px', borderRadius: '12px', backgroundColor: '#e3fcef', color: 'var(--success-color)', fontSize: '0.875rem' }}>{template.format} format</span>
        </div>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          {template.description}
        </p>
        
        <Button size="large" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => alert("File downloading... (MVP Placeholder)")}>
          <FiDownload /> Download {template.format} File
        </Button>
      </div>
    </Layout>
  );
}
