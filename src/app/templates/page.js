"use client";

import Layout from "@/components/Layout";
import { Card } from "@/components/Card";
import templatesData from "@/data/templates.json";
import styles from "../page.module.css";
import { FiDownload } from "react-icons/fi";
import { useState } from "react";

export default function TemplatesLibrary() {
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState(null);

  const downloadTemplate = async (id, displayName) => {
    setDownloading(id);
    setError(null);
    
    try {
      const response = await fetch(`/api/templates/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setError(`Failed to download "${displayName}". ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Templates Library</h1>
          <p className={styles.pageSubtitle}>Download professional resources and checklists for your NGO.</p>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '8px', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #ef4444',
          color: '#b91c1c',
          marginBottom: '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div className={styles.grid}>
        {templatesData.map(template => (
          <Card 
            key={template.id} 
            title={template.title} 
            badge={template.format} 
            badgeType="success"
          >
            <p style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 500 }}>
              {template.category}
            </p>
            <p style={{ minHeight: '60px' }}>{template.description}</p>
            
            <div style={{ 
              marginTop: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiDownload size={14} />
                <span>{template.format} • {template.fileSize}</span>
              </div>
              <button 
                onClick={() => downloadTemplate(template.id, template.title)}
                disabled={downloading === template.id}
                style={{ 
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: downloading === template.id ? '#9ca3af' : 'var(--primary-color)',
                  color: 'white',
                  cursor: downloading === template.id ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (downloading !== template.id) {
                    e.currentTarget.style.opacity = '0.8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (downloading !== template.id) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
              >
                {downloading === template.id ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}