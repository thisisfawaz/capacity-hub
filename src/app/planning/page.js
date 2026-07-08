"use client";

import Layout from "@/components/Layout";
import { Card, Button } from "@/components/Card";
import styles from "../page.module.css";
import { useState } from "react";
import { FiPrinter } from "react-icons/fi";

export default function PlanningCentre() {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    { id: "swot", title: "SWOT Builder", description: "Identify Strengths, Weaknesses, Opportunities, and Threats for your organisation or a specific project." },
    { id: "toc", title: "Theory of Change Builder", description: "Map out how your interventions lead to long-term impact." },
    { id: "risk", title: "Risk Assessment Matrix", description: "Identify potential risks and develop mitigation strategies." }
  ];

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Planning Centre</h1>
          <p className={styles.pageSubtitle}>Practical tools to help your NGO plan strategically and effectively.</p>
        </div>
      </div>

      {!activeTool ? (
        <div className={styles.grid}>
          {tools.map(tool => (
            <Card key={tool.id} title={tool.title} actionText="Open Builder" actionLink="#" outlineAction={true}>
              <div onClick={(e) => { e.preventDefault(); setActiveTool(tool.id); }} style={{ height: '100%', cursor: 'pointer' }}>
                <p>{tool.description}</p>
                <div style={{ marginTop: '1rem' }}>
                  <Button variant="outline">Open Builder</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <Button variant="outline" onClick={() => setActiveTool(null)}>← Back to Tools</Button>
          </div>
          <div className={styles.statCard} style={{ display: 'block', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{tools.find(t => t.id === activeTool)?.title}</h2>
              <Button variant="outline"><FiPrinter /> Print Summary</Button>
            </div>
            
            {activeTool === 'swot' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--success-color)' }}>Strengths</h3>
                  <textarea placeholder="List your internal strengths..." style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
                <div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--danger-color)' }}>Weaknesses</h3>
                  <textarea placeholder="List your internal weaknesses..." style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
                <div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Opportunities</h3>
                  <textarea placeholder="List external opportunities..." style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
                <div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--warning-color)' }}>Threats</h3>
                  <textarea placeholder="List external threats..." style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
              </div>
            )}
            
            {activeTool === 'toc' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Inputs</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>What resources (financial, human, material) will you invest?</p>
                  <textarea placeholder="e.g., $50,000 grant, 3 full-time staff, office space..." style={{ width: '100%', height: '80px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Activities</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>What will you do with these resources?</p>
                  <textarea placeholder="e.g., Conduct 5 training workshops for 100 teachers..." style={{ width: '100%', height: '80px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Outputs</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>What are the direct, tangible results of your activities?</p>
                  <textarea placeholder="e.g., 100 teachers trained, 5 manuals distributed..." style={{ width: '100%', height: '80px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Outcomes</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>What short to medium-term changes result from your outputs?</p>
                  <textarea placeholder="e.g., Teachers implement new curriculum, student engagement increases by 20%..." style={{ width: '100%', height: '80px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Impact</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>What is the long-term, ultimate change you aim to achieve?</p>
                  <textarea placeholder="e.g., Improved national literacy rates and better employment opportunities..." style={{ width: '100%', height: '80px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                </div>
              </div>
            )}

            {activeTool === 'risk' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '1rem', fontWeight: 600, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>Risk Description</div>
                  <div>Likelihood</div>
                  <div>Impact</div>
                  <div>Mitigation Strategy</div>
                </div>
                {[1, 2, 3, 4, 5].map((row) => (
                  <div key={row} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '1rem' }}>
                    <input type="text" placeholder={`Risk ${row}...`} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                    <input type="text" placeholder={`Mitigation for Risk ${row}...`} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                  </div>
                ))}
                <div style={{ marginTop: '1rem' }}>
                  <Button variant="outline">+ Add Risk Row</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
