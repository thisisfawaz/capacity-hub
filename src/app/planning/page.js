"use client";

import Layout from "@/components/Layout";
import { Card, Button } from "@/components/Card";
import styles from "../page.module.css";
import { useState, useRef } from "react";
import { 
  FiPrinter, FiArrowLeft, FiPlus, FiCheck, FiDownload, 
  FiShare2, FiFileText, FiEye, FiEdit2, FiTrash2,
  FiCopy, FiSend, FiSave, FiRefreshCw
} from "react-icons/fi";

export default function PlanningCentre() {
  const [activeTool, setActiveTool] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const printRef = useRef(null);

  // ============================================================
  // STATE FOR EACH TOOL
  // ============================================================

  // SWOT Builder
  const [swotStep, setSwotStep] = useState(1);
  const [swotData, setSwotData] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });
  const [swotCustom, setSwotCustom] = useState({
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: ""
  });
  const [swotResult, setSwotResult] = useState(null);

  // Theory of Change
  const [tocStep, setTocStep] = useState(1);
  const [tocData, setTocData] = useState({
    inputs: [],
    activities: [],
    outputs: [],
    outcomes: [],
    impact: []
  });
  const [tocCustom, setTocCustom] = useState({
    inputs: "",
    activities: "",
    outputs: "",
    outcomes: "",
    impact: ""
  });
  const [tocResult, setTocResult] = useState(null);

  // Risk Assessment
  const [risks, setRisks] = useState([
    { id: 1, description: "", likelihood: "low", impact: "low", mitigation: "" },
    { id: 2, description: "", likelihood: "low", impact: "low", mitigation: "" },
    { id: 3, description: "", likelihood: "low", impact: "low", mitigation: "" },
    { id: 4, description: "", likelihood: "low", impact: "low", mitigation: "" },
    { id: 5, description: "", likelihood: "low", impact: "low", mitigation: "" }
  ]);
  const [riskResult, setRiskResult] = useState(null);

  // Grant Readiness
  const [readinessChecks, setReadinessChecks] = useState({
    org1: false, org2: false, org3: false, org4: false, org5: false,
    proj1: false, proj2: false, proj3: false, proj4: false, proj5: false,
    fin1: false, fin2: false, fin3: false, fin4: false, fin5: false,
    tech1: false, tech2: false, tech3: false, tech4: false, tech5: false,
    part1: false, part2: false, part3: false, part4: false, part5: false
  });
  const [readinessResult, setReadinessResult] = useState(null);

  // Proposal Writing
  const [proposalStep, setProposalStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [proposalChecks, setProposalChecks] = useState({
    research: false, language: false, examples: false, impact: false, budget: false, proofread: false
  });
  const [proposalContent, setProposalContent] = useState("");
  const [proposalResult, setProposalResult] = useState(null);

  // ============================================================
  // TOOLS CONFIGURATION
  // ============================================================

  const tools = [
    { id: "swot", title: "SWOT Builder", description: "Identify Strengths, Weaknesses, Opportunities, and Threats for your organisation or a specific project.", icon: "", color: "#4f46e5" },
    { id: "toc", title: "Theory of Change Builder", description: "Map out how your interventions lead to long-term impact.", icon: "", color: "#10b981" },
    { id: "risk", title: "Risk Assessment Matrix", description: "Identify potential risks and develop mitigation strategies.", icon: "", color: "#f59e0b" },
    { id: "readiness", title: "Grant Readiness Toolkit", description: "Assess your organization's readiness and identify gaps before applying for grants.", icon: "", color: "#3b82f6" },
    { id: "proposal", title: "Proposal Writing Toolkit", description: "Step-by-step templates, outlines, and guides for writing winning proposals.", icon: "", color: "#8b5cf6" }
  ];

  const getTool = (id) => tools.find(t => t.id === id);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  // Toggle checklist item
  const toggleReadinessCheck = (id) => {
    setReadinessChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle proposal check
  const toggleProposalCheck = (id) => {
    setProposalChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle SWOT selection
  const toggleSwotSelection = (category, item) => {
    setSwotData(prev => {
      const current = prev[category];
      if (current.includes(item)) {
        return { ...prev, [category]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...current, item] };
      }
    });
  };

  // Toggle ToC selection
  const toggleTocSelection = (category, item) => {
    setTocData(prev => {
      const current = prev[category];
      if (current.includes(item)) {
        return { ...prev, [category]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...current, item] };
      }
    });
  };

  // Update risk field
  const updateRisk = (id, field, value) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Add risk row
  const addRiskRow = () => {
    const newId = risks.length > 0 ? Math.max(...risks.map(r => r.id)) + 1 : 1;
    setRisks([...risks, { id: newId, description: "", likelihood: "low", impact: "low", mitigation: "" }]);
  };

  // Remove risk row
  const removeRiskRow = (id) => {
    if (risks.length > 1) {
      setRisks(risks.filter(r => r.id !== id));
    }
  };

  // Get readiness progress
  const getReadinessProgress = (prefix) => {
    const keys = Object.keys(readinessChecks).filter(k => k.startsWith(prefix));
    const checked = keys.filter(k => readinessChecks[k]).length;
    return { total: keys.length, checked };
  };

  const getTotalReadiness = () => {
    const total = Object.keys(readinessChecks).length;
    const checked = Object.values(readinessChecks).filter(v => v).length;
    return { total, checked, percentage: Math.round((checked / total) * 100) };
  };

  const getRiskSummary = () => {
    const low = risks.filter(r => r.likelihood === 'low' && r.impact === 'low').length;
    const medium = risks.filter(r => r.likelihood === 'medium' || r.impact === 'medium').length;
    const high = risks.filter(r => r.likelihood === 'high' || r.impact === 'high').length;
    return { low, medium, high };
  };

  // ============================================================
  // GENERATE RESULTS FUNCTIONS
  // ============================================================

  const generateSwotResult = () => {
    const allStrengths = [...swotData.strengths, ...(swotCustom.strengths ? [swotCustom.strengths] : [])];
    const allWeaknesses = [...swotData.weaknesses, ...(swotCustom.weaknesses ? [swotCustom.weaknesses] : [])];
    const allOpportunities = [...swotData.opportunities, ...(swotCustom.opportunities ? [swotCustom.opportunities] : [])];
    const allThreats = [...swotData.threats, ...(swotCustom.threats ? [swotCustom.threats] : [])];

    setSwotResult({
      strengths: allStrengths.filter(s => s.trim()),
      weaknesses: allWeaknesses.filter(w => w.trim()),
      opportunities: allOpportunities.filter(o => o.trim()),
      threats: allThreats.filter(t => t.trim()),
      generatedAt: new Date().toLocaleString()
    });
    setShowResult(true);
    setSwotStep(5);
  };

  const generateTocResult = () => {
    const allInputs = [...tocData.inputs, ...(tocCustom.inputs ? [tocCustom.inputs] : [])];
    const allActivities = [...tocData.activities, ...(tocCustom.activities ? [tocCustom.activities] : [])];
    const allOutputs = [...tocData.outputs, ...(tocCustom.outputs ? [tocCustom.outputs] : [])];
    const allOutcomes = [...tocData.outcomes, ...(tocCustom.outcomes ? [tocCustom.outcomes] : [])];
    const allImpact = [...tocData.impact, ...(tocCustom.impact ? [tocCustom.impact] : [])];

    setTocResult({
      inputs: allInputs.filter(i => i.trim()),
      activities: allActivities.filter(a => a.trim()),
      outputs: allOutputs.filter(o => o.trim()),
      outcomes: allOutcomes.filter(o => o.trim()),
      impact: allImpact.filter(i => i.trim()),
      generatedAt: new Date().toLocaleString()
    });
    setShowResult(true);
    setTocStep(6);
  };

  const generateRiskResult = () => {
    const validRisks = risks.filter(r => r.description.trim());
    setRiskResult({
      risks: validRisks,
      summary: getRiskSummary(),
      generatedAt: new Date().toLocaleString()
    });
    setShowResult(true);
  };

  const generateReadinessResult = () => {
    const total = getTotalReadiness();
    const categories = [
      { name: "Organizational", prefix: "org", progress: getReadinessProgress("org") },
      { name: "Project", prefix: "proj", progress: getReadinessProgress("proj") },
      { name: "Financial", prefix: "fin", progress: getReadinessProgress("fin") },
      { name: "Technical", prefix: "tech", progress: getReadinessProgress("tech") },
      { name: "Partnership", prefix: "part", progress: getReadinessProgress("part") }
    ];

    const status = total.percentage >= 80 ? "Ready to Apply" : 
                   total.percentage >= 50 ? "In Progress" : "Needs Improvement";

    setReadinessResult({
      total: total,
      categories: categories,
      status: status,
      recommendations: [
        "Complete all required checklist items before applying",
        "Ensure financial statements are audited and up to date",
        "Document all policies and procedures",
        "Build partnerships and community relationships early",
        "Develop a strong M&E framework"
      ],
      generatedAt: new Date().toLocaleString()
    });
    setShowResult(true);
  };

  const generateProposalResult = () => {
    const templateNames = {
      concept: "Concept Note",
      full: "Full Proposal",
      budget: "Budget Template",
      cover: "Cover Letter"
    };

    const completedChecks = Object.values(proposalChecks).filter(v => v).length;

    setProposalResult({
      template: selectedTemplate ? templateNames[selectedTemplate] : "None Selected",
      checklist: proposalChecks,
      completedChecks: completedChecks,
      totalChecks: Object.keys(proposalChecks).length,
      content: proposalContent || "No content written yet.",
      status: completedChecks === Object.keys(proposalChecks).length ? "Ready to Submit" : "In Progress",
      generatedAt: new Date().toLocaleString()
    });
    setShowResult(true);
    setProposalStep(4);
  };

  // ============================================================
  // DOWNLOAD PDF FUNCTIONS
  // ============================================================

  const downloadPDF = (content, filename) => {
    // Create a simple text version since we can't use PDF libraries without installation
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadSwot = () => {
    if (!swotResult) return;
    const content = `
=== SWOT ANALYSIS ===
Generated: ${swotResult.generatedAt}

STRENGTHS:
${swotResult.strengths.map(s => `  - ${s}`).join('\n')}

WEAKNESSES:
${swotResult.weaknesses.map(w => `  - ${w}`).join('\n')}

OPPORTUNITIES:
${swotResult.opportunities.map(o => `  - ${o}`).join('\n')}

THREATS:
${swotResult.threats.map(t => `  - ${t}`).join('\n')}

---
Created with CapacityHub Planning Centre
    `;
    downloadPDF(content, 'swot-analysis');
  };

  const handleDownloadToc = () => {
    if (!tocResult) return;
    const content = `
=== THEORY OF CHANGE ===
Generated: ${tocResult.generatedAt}

INPUTS:
${tocResult.inputs.map(i => `  - ${i}`).join('\n')}

ACTIVITIES:
${tocResult.activities.map(a => `  - ${a}`).join('\n')}

OUTPUTS:
${tocResult.outputs.map(o => `  - ${o}`).join('\n')}

OUTCOMES:
${tocResult.outcomes.map(o => `  - ${o}`).join('\n')}

IMPACT:
${tocResult.impact.map(i => `  - ${i}`).join('\n')}

---
Created with CapacityHub Planning Centre
    `;
    downloadPDF(content, 'theory-of-change');
  };

  const handleDownloadRisk = () => {
    if (!riskResult) return;
    const content = `
=== RISK ASSESSMENT MATRIX ===
Generated: ${riskResult.generatedAt}

RISK SUMMARY:
  Low Risk: ${riskResult.summary.low}
  Medium Risk: ${riskResult.summary.medium}
  High Risk: ${riskResult.summary.high}

RISK DETAILS:
${riskResult.risks.map(r => `
  Risk: ${r.description}
  Likelihood: ${r.likelihood}
  Impact: ${r.impact}
  Mitigation: ${r.mitigation || 'None specified'}
  ${'-'.repeat(40)}
`).join('\n')}

---
Created with CapacityHub Planning Centre
    `;
    downloadPDF(content, 'risk-assessment');
  };

  const handleDownloadReadiness = () => {
    if (!readinessResult) return;
    const content = `
=== GRANT READINESS ASSESSMENT ===
Generated: ${readinessResult.generatedAt}

OVERALL STATUS: ${readinessResult.status}
Score: ${readinessResult.total.checked}/${readinessResult.total.total} (${readinessResult.total.percentage}%)

CATEGORY BREAKDOWN:
${readinessResult.categories.map(c => `  ${c.name}: ${c.progress.checked}/${c.progress.total}`).join('\n')}

RECOMMENDATIONS:
${readinessResult.recommendations.map(r => `  - ${r}`).join('\n')}

---
Created with CapacityHub Planning Centre
    `;
    downloadPDF(content, 'grant-readiness');
  };

  const handleDownloadProposal = () => {
    if (!proposalResult) return;
    const content = `
=== PROPOSAL WRITING SUMMARY ===
Generated: ${proposalResult.generatedAt}

Template Selected: ${proposalResult.template}
Status: ${proposalResult.status}
Checklist: ${proposalResult.completedChecks}/${proposalResult.totalChecks} completed

CONTENT:
${proposalResult.content}

---
Created with CapacityHub Planning Centre
    `;
    downloadPDF(content, 'proposal-writing');
  };

  // ============================================================
  // RESET FUNCTIONS
  // ============================================================

  const resetSwot = () => {
    setSwotStep(1);
    setSwotData({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
    setSwotCustom({ strengths: "", weaknesses: "", opportunities: "", threats: "" });
    setSwotResult(null);
    setShowResult(false);
  };

  const resetToc = () => {
    setTocStep(1);
    setTocData({ inputs: [], activities: [], outputs: [], outcomes: [], impact: [] });
    setTocCustom({ inputs: "", activities: "", outputs: "", outcomes: "", impact: "" });
    setTocResult(null);
    setShowResult(false);
  };

  const resetRisk = () => {
    setRisks([
      { id: 1, description: "", likelihood: "low", impact: "low", mitigation: "" },
      { id: 2, description: "", likelihood: "low", impact: "low", mitigation: "" },
      { id: 3, description: "", likelihood: "low", impact: "low", mitigation: "" },
      { id: 4, description: "", likelihood: "low", impact: "low", mitigation: "" },
      { id: 5, description: "", likelihood: "low", impact: "low", mitigation: "" }
    ]);
    setRiskResult(null);
    setShowResult(false);
  };

  const resetReadiness = () => {
    const resetObj = {};
    Object.keys(readinessChecks).forEach(key => resetObj[key] = false);
    setReadinessChecks(resetObj);
    setReadinessResult(null);
    setShowResult(false);
  };

  const resetProposal = () => {
    setProposalStep(1);
    setSelectedTemplate(null);
    const resetObj = {};
    Object.keys(proposalChecks).forEach(key => resetObj[key] = false);
    setProposalChecks(resetObj);
    setProposalContent("");
    setProposalResult(null);
    setShowResult(false);
  };

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================

  const renderSwotResult = () => {
    if (!swotResult) return null;
    return (
      <div ref={printRef} style={{ marginTop: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '2px solid #4f46e5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#4f46e5' }}>📊 SWOT Analysis Results</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Generated: {swotResult.generatedAt}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: '#10b981' }}>💪 Strengths</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {swotResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                {swotResult.strengths.length === 0 && <li style={{ color: 'var(--text-secondary)' }}>No strengths added</li>}
              </ul>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ color: '#ef4444' }}>⚠️ Weaknesses</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {swotResult.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                {swotResult.weaknesses.length === 0 && <li style={{ color: 'var(--text-secondary)' }}>No weaknesses added</li>}
              </ul>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ color: '#3b82f6' }}>🌟 Opportunities</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {swotResult.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                {swotResult.opportunities.length === 0 && <li style={{ color: 'var(--text-secondary)' }}>No opportunities added</li>}
              </ul>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ color: '#f59e0b' }}>🔥 Threats</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {swotResult.threats.map((t, i) => <li key={i}>{t}</li>)}
                {swotResult.threats.length === 0 && <li style={{ color: 'var(--text-secondary)' }}>No threats added</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTocResult = () => {
    if (!tocResult) return null;
    return (
      <div ref={printRef} style={{ marginTop: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '2px solid #10b981'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#10b981' }}>🔄 Theory of Change</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Generated: {tocResult.generatedAt}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white' }}>
              <h4 style={{ color: 'white' }}>🔧 Inputs</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {tocResult.inputs.map((i, idx) => <li key={idx}>{i}</li>)}
                {tocResult.inputs.length === 0 && <li>No inputs added</li>}
              </ul>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
              <h4 style={{ color: 'white' }}>📋 Activities</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {tocResult.activities.map((a, idx) => <li key={idx}>{a}</li>)}
                {tocResult.activities.length === 0 && <li>No activities added</li>}
              </ul>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #14b8a6)', color: 'white' }}>
              <h4 style={{ color: 'white' }}>📤 Outputs</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {tocResult.outputs.map((o, idx) => <li key={idx}>{o}</li>)}
                {tocResult.outputs.length === 0 && <li>No outputs added</li>}
              </ul>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #34d399, #2dd4bf)', color: 'white' }}>
              <h4 style={{ color: 'white' }}>📈 Outcomes</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {tocResult.outcomes.map((o, idx) => <li key={idx}>{o}</li>)}
                {tocResult.outcomes.length === 0 && <li>No outcomes added</li>}
              </ul>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #a855f7)', color: 'white' }}>
              <h4 style={{ color: 'white' }}>🎯 Impact</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {tocResult.impact.map((i, idx) => <li key={idx}>{i}</li>)}
                {tocResult.impact.length === 0 && <li>No impact defined</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRiskResult = () => {
    if (!riskResult) return null;
    return (
      <div ref={printRef} style={{ marginTop: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '2px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#f59e0b' }}>⚠️ Risk Assessment Results</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Generated: {riskResult.generatedAt}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '8px', backgroundColor: '#ecfdf5' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{riskResult.summary.low}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🟢 Low Risk</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '8px', backgroundColor: '#fffbeb' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{riskResult.summary.medium}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🟡 Medium Risk</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{riskResult.summary.high}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🔴 High Risk</div>
            </div>
          </div>

          <h4 style={{ marginBottom: '0.5rem' }}>Risk Details</h4>
          {riskResult.risks.map((r, idx) => (
            <div key={idx} style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-card)',
              marginBottom: '0.5rem',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{r.description}</strong>
                <span>
                  <span style={{ 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.7rem',
                    backgroundColor: r.likelihood === 'high' ? '#fef2f2' : r.likelihood === 'medium' ? '#fffbeb' : '#ecfdf5',
                    color: r.likelihood === 'high' ? '#ef4444' : r.likelihood === 'medium' ? '#f59e0b' : '#10b981'
                  }}>
                    {r.likelihood}
                  </span>
                  <span style={{ marginLeft: '0.5rem',
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.7rem',
                    backgroundColor: r.impact === 'high' ? '#fef2f2' : r.impact === 'medium' ? '#fffbeb' : '#ecfdf5',
                    color: r.impact === 'high' ? '#ef4444' : r.impact === 'medium' ? '#f59e0b' : '#10b981'
                  }}>
                    {r.impact}
                  </span>
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Mitigation: {r.mitigation || 'None specified'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReadinessResult = () => {
    if (!readinessResult) return null;
    return (
      <div ref={printRef} style={{ marginTop: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '2px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#3b82f6' }}>✅ Grant Readiness Report</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Generated: {readinessResult.generatedAt}
            </span>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: readinessResult.status === 'Ready to Apply' ? '#ecfdf5' : 
                            readinessResult.status === 'In Progress' ? '#fffbeb' : '#fef2f2',
            border: `1px solid ${readinessResult.status === 'Ready to Apply' ? '#10b981' : readinessResult.status === 'In Progress' ? '#f59e0b' : '#ef4444'}`,
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Overall Status:</span>
              <span style={{ 
                fontWeight: 700,
                color: readinessResult.status === 'Ready to Apply' ? '#10b981' : 
                       readinessResult.status === 'In Progress' ? '#f59e0b' : '#ef4444'
              }}>
                {readinessResult.status} ({readinessResult.total.percentage}%)
              </span>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: 'var(--border-color)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${readinessResult.total.percentage}%`,
                  height: '100%',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {readinessResult.categories.map((cat, idx) => (
              <div key={idx} style={{
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                textAlign: 'center',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cat.name}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{cat.progress.checked}/{cat.progress.total}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b'
          }}>
            <h4 style={{ color: '#b45309' }}>💡 Recommendations</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#92400e' }}>
              {readinessResult.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderProposalResult = () => {
    if (!proposalResult) return null;
    return (
      <div ref={printRef} style={{ marginTop: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '2px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#8b5cf6' }}>✍️ Proposal Summary</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Generated: {proposalResult.generatedAt}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Template</div>
              <div style={{ fontWeight: 600 }}>{proposalResult.template}</div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</div>
              <div style={{ 
                fontWeight: 600,
                color: proposalResult.status === 'Ready to Submit' ? '#10b981' : '#f59e0b'
              }}>
                {proposalResult.status}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Checklist Progress</h4>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              borderRadius: '4px', 
              backgroundColor: 'var(--border-color)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(proposalResult.completedChecks / proposalResult.totalChecks) * 100}%`,
                height: '100%',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #8b5cf6, #a855f7)'
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {proposalResult.completedChecks}/{proposalResult.totalChecks} completed
            </div>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Content</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {proposalResult.content || 'No content written yet.'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================

  const renderToolContent = () => {
    switch (activeTool) {
      case 'swot': return renderSwotContent();
      case 'toc': return renderTocContent();
      case 'risk': return renderRiskContent();
      case 'readiness': return renderReadinessContent();
      case 'proposal': return renderProposalContent();
      default: return null;
    }
  };

  // ============================================================
  // SWOT CONTENT
  // ============================================================
  const renderSwotContent = () => {
    if (showResult && swotResult) {
      return (
        <div>
          {renderSwotResult()}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Button onClick={handleDownloadSwot}><FiDownload /> Download PDF</Button>
            <Button variant="outline" onClick={() => window.print()}>🖨️ Print</Button>
            <Button variant="outline" onClick={resetSwot}>🔄 Start Over</Button>
            <Button variant="outline" onClick={() => { setShowResult(false); setSwotStep(1); }}>✏️ Edit</Button>
          </div>
        </div>
      );
    }

    const swotSteps = [
      { id: 1, title: "Strengths", color: "#10b981", icon: "💪", items: ['Strong community relationships', 'Skilled staff team', 'Proven track record', 'Unique expertise', 'Strategic partnerships', 'Good reputation'] },
      { id: 2, title: "Weaknesses", color: "#ef4444", icon: "⚠️", items: ['Limited funding', 'Small team', 'Lack of experience', 'Limited reach', 'Weak infrastructure', 'High staff turnover'] },
      { id: 3, title: "Opportunities", color: "#3b82f6", icon: "🌟", items: ['New funding sources', 'Growing demand', 'Strategic partnerships', 'Technology adoption', 'Policy changes', 'Expanding networks'] },
      { id: 4, title: "Threats", color: "#f59e0b", icon: "🔥", items: ['Funding cuts', 'Competition', 'Policy changes', 'Economic downturn', 'Staff turnover', 'Security concerns'] }
    ];

    const currentStep = swotSteps[swotStep - 1];
    const categoryMap = ['strengths', 'weaknesses', 'opportunities', 'threats'];
    const category = categoryMap[swotStep - 1];

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Step {swotStep} of 4: {currentStep.title}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{Math.round((swotStep / 4) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
            <div style={{ width: `${(swotStep / 4) * 100}%`, height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: currentStep.color }}>
            {currentStep.icon} Step {swotStep}: Identify Your {currentStep.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {swotStep === 1 && "What advantages does your organization have? What do you do better than others?"}
            {swotStep === 2 && "What could you improve? What do others do better than you?"}
            {swotStep === 3 && "What opportunities are available to you? What trends can you capitalize on?"}
            {swotStep === 4 && "What challenges do you face? What could harm your success?"}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {currentStep.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                border: `1px solid ${swotData[category]?.includes(item) ? currentStep.color : 'var(--border-color)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: swotData[category]?.includes(item) ? `${currentStep.color}15` : 'transparent'
              }}
              onClick={() => toggleSwotSelection(category, item)}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: `2px solid ${swotData[category]?.includes(item) ? currentStep.color : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: swotData[category]?.includes(item) ? currentStep.color : 'transparent',
                  color: 'white'
                }}>
                  {swotData[category]?.includes(item) && <FiCheck size={14} />}
                </div>
                <span style={{ fontSize: '0.95rem' }}>{item}</span>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <textarea 
              placeholder={`Add your own ${currentStep.title.toLowerCase()}...`}
              value={swotCustom[category]}
              onChange={(e) => setSwotCustom(prev => ({ ...prev, [category]: e.target.value }))}
              style={{ 
                width: '100%', 
                height: '60px', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)'
              }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {swotStep > 1 && <Button variant="outline" onClick={() => setSwotStep(swotStep - 1)}>← Previous</Button>}
          {swotStep < 4 && <Button onClick={() => setSwotStep(swotStep + 1)}>Next Step →</Button>}
          {swotStep === 4 && <Button onClick={generateSwotResult}>Generate SWOT Analysis</Button>}
          <Button variant="outline" onClick={resetSwot}>🔄 Reset</Button>
        </div>
      </div>
    );
  };

  // ============================================================
  // TOC CONTENT
  // ============================================================
  const renderTocContent = () => {
    if (showResult && tocResult) {
      return (
        <div>
          {renderTocResult()}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Button onClick={handleDownloadToc}><FiDownload /> Download PDF</Button>
            <Button variant="outline" onClick={() => window.print()}>🖨️ Print</Button>
            <Button variant="outline" onClick={resetToc}>🔄 Start Over</Button>
            <Button variant="outline" onClick={() => { setShowResult(false); setTocStep(1); }}>✏️ Edit</Button>
          </div>
        </div>
      );
    }

    const tocSteps = [
      { id: 1, title: "Inputs", icon: "🔧", color: "#4f46e5", items: ['Staff', 'Funding', 'Office space', 'Equipment', 'Training materials', 'Technology'] },
      { id: 2, title: "Activities", icon: "📋", color: "#6366f1", items: ['Training workshops', 'Community outreach', 'Research', 'Advocacy', 'Monitoring', 'Reporting'] },
      { id: 3, title: "Outputs", icon: "📤", color: "#10b981", items: ['Number trained', 'Materials produced', 'Reports published', 'Events held', 'People reached', 'Partnerships formed'] },
      { id: 4, title: "Outcomes", icon: "📈", color: "#34d399", items: ['Knowledge gained', 'Skills improved', 'Behavior changed', 'Awareness raised', 'Policies influenced', 'Practice improved'] },
      { id: 5, title: "Impact", icon: "🎯", color: "#8b5cf6", items: ['Sustainable change', 'Systemic improvement', 'Community development', 'Economic growth', 'Environmental impact', 'Social change'] }
    ];

    const currentStep = tocSteps[tocStep - 1];
    const categoryMap = ['inputs', 'activities', 'outputs', 'outcomes', 'impact'];
    const category = categoryMap[tocStep - 1];

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Step {tocStep} of 5: {currentStep.title}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{Math.round((tocStep / 5) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
            <div style={{ width: `${(tocStep / 5) * 100}%`, height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            background: `linear-gradient(135deg, ${currentStep.color} 0%, ${currentStep.color}cc 100%)`,
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'white' }}>{currentStep.icon} Step {tocStep}: {currentStep.title}</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '1rem' }}>
              {tocStep === 1 && "What resources (financial, human, material) will you invest?"}
              {tocStep === 2 && "What will you do with these resources?"}
              {tocStep === 3 && "What are the direct, tangible results of your activities?"}
              {tocStep === 4 && "What short to medium-term changes result from your outputs?"}
              {tocStep === 5 && "What is the long-term, ultimate change you aim to achieve?"}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {currentStep.items.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: tocData[category]?.includes(item) ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => toggleTocSelection(category, item)}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${tocData[category]?.includes(item) ? 'white' : 'rgba(255,255,255,0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: tocData[category]?.includes(item) ? 'white' : 'transparent'
                  }}>
                    {tocData[category]?.includes(item) && <FiCheck size={12} color={currentStep.color} />}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{item}</span>
                </div>
              ))}
            </div>
            
            <textarea 
              placeholder={`Add your own ${currentStep.title.toLowerCase()}...`}
              value={tocCustom[category]}
              onChange={(e) => setTocCustom(prev => ({ ...prev, [category]: e.target.value }))}
              style={{ 
                width: '100%', 
                height: '60px', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: 'none',
                marginTop: '1rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {tocStep > 1 && <Button variant="outline" onClick={() => setTocStep(tocStep - 1)}>← Previous</Button>}
          {tocStep < 5 && <Button onClick={() => setTocStep(tocStep + 1)}>Next Step →</Button>}
          {tocStep === 5 && <Button onClick={generateTocResult}>Generate Theory of Change</Button>}
          <Button variant="outline" onClick={resetToc}>🔄 Reset</Button>
        </div>
      </div>
    );
  };

  // ============================================================
  // RISK CONTENT
  // ============================================================
  const renderRiskContent = () => {
    if (showResult && riskResult) {
      return (
        <div>
          {renderRiskResult()}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Button onClick={handleDownloadRisk}><FiDownload /> Download PDF</Button>
            <Button variant="outline" onClick={() => window.print()}>🖨️ Print</Button>
            <Button variant="outline" onClick={resetRisk}>🔄 Start Over</Button>
            <Button variant="outline" onClick={() => { setShowResult(false); }}>✏️ Edit</Button>
          </div>
        </div>
      );
    }

    const riskSummary = getRiskSummary();

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Risk Assessment</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {risks.filter(r => r.description.trim() !== '').length}/{risks.length} completed
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
            <div style={{
              width: `${(risks.filter(r => r.description.trim() !== '').length / risks.length) * 100}%`,
              height: '100%',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr 2fr 0.5fr', 
          gap: '0.75rem', 
          fontWeight: 600, 
          paddingBottom: '0.5rem', 
          borderBottom: '2px solid var(--border-color)',
          marginBottom: '1rem'
        }}>
          <div>Risk Description</div>
          <div>Likelihood</div>
          <div>Impact</div>
          <div>Mitigation Strategy</div>
          <div></div>
        </div>

        {risks.map((risk) => (
          <div key={risk.id} style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 2fr 0.5fr', 
            gap: '0.75rem', 
            alignItems: 'center',
            padding: '0.4rem 0',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <input 
              type="text" 
              placeholder={`Risk ${risk.id}...`} 
              value={risk.description}
              onChange={(e) => updateRisk(risk.id, 'description', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '0.9rem'
              }} 
            />
            <select 
              value={risk.likelihood}
              onChange={(e) => updateRisk(risk.id, 'likelihood', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '0.9rem'
              }}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <select 
              value={risk.impact}
              onChange={(e) => updateRisk(risk.id, 'impact', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '0.9rem'
              }}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <input 
              type="text" 
              placeholder={`Mitigation ${risk.id}...`} 
              value={risk.mitigation}
              onChange={(e) => updateRisk(risk.id, 'mitigation', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '0.9rem'
              }} 
            />
            <button
              onClick={() => removeRiskRow(risk.id)}
              style={{
                padding: '0.4rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              disabled={risks.length === 1}
            >
              🗑️
            </button>
          </div>
        ))}

        <div style={{ marginTop: '1rem' }}>
          <Button variant="outline" onClick={addRiskRow}><FiPlus /> Add Risk Row</Button>
        </div>

        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>📊 Risk Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{riskSummary.low}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Low Risk</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{riskSummary.medium}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Medium Risk</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{riskSummary.high}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>High Risk</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Button onClick={generateRiskResult}>Generate Risk Assessment</Button>
          <Button variant="outline" onClick={resetRisk}>🔄 Reset</Button>
        </div>
      </div>
    );
  };

  // ============================================================
  // READINESS CONTENT
  // ============================================================
  const renderReadinessContent = () => {
    if (showResult && readinessResult) {
      return (
        <div>
          {renderReadinessResult()}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Button onClick={handleDownloadReadiness}><FiDownload /> Download PDF</Button>
            <Button variant="outline" onClick={() => window.print()}>🖨️ Print</Button>
            <Button variant="outline" onClick={resetReadiness}>🔄 Start Over</Button>
            <Button variant="outline" onClick={() => { setShowResult(false); }}>✏️ Edit</Button>
          </div>
        </div>
      );
    }

    const readinessCategories = [
      { prefix: 'org', label: 'Organizational', color: '#4f46e5' },
      { prefix: 'proj', label: 'Project', color: '#10b981' },
      { prefix: 'fin', label: 'Financial', color: '#f59e0b' },
      { prefix: 'tech', label: 'Technical', color: '#3b82f6' },
      { prefix: 'part', label: 'Partnership', color: '#8b5cf6' }
    ];

    const readinessItems = {
      org: ['Clear mission and vision statement', 'Registered NGO/CBO status', 'Board of directors/Advisory board established', 'Operational policies and procedures documented', 'Audited financial statements available'],
      proj: ['Clear project objectives and outcomes', 'Detailed project timeline', 'Realistic budget breakdown', 'Monitoring and evaluation plan', 'Risk mitigation strategy'],
      fin: ['Bank account for grant funds', 'Financial management system', 'Internal controls and approvals', 'Procurement policy', 'Budget tracking mechanism'],
      tech: ['Technical capacity for project delivery', 'Qualified staff and expertise', 'Relevant experience in sector', 'Track record of success', 'Innovation and adaptability'],
      part: ['Existing partnerships in sector', 'Community relationships', 'Government relations', 'Referral networks', 'Collaboration agreements']
    };

    const readinessTotal = getTotalReadiness();

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Readiness Assessment</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {readinessTotal.percentage}% ({readinessTotal.checked}/{readinessTotal.total})
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
            <div style={{
              width: `${readinessTotal.percentage}%`,
              height: '100%',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {readinessCategories.map((cat) => {
            const progress = getReadinessProgress(cat.prefix);
            return (
              <div key={cat.prefix} style={{
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: cat.color }}>
                  {progress.checked}/{progress.total}
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '4px', 
                  borderRadius: '2px', 
                  backgroundColor: 'var(--border-color)',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(progress.checked / progress.total) * 100}%`,
                    height: '100%',
                    borderRadius: '2px',
                    backgroundColor: cat.color
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {readinessCategories.map((cat) => (
          <div key={cat.prefix} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', color: cat.color }}>{cat.label} Readiness</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {readinessItems[cat.prefix].map((item, i) => {
                const id = `${cat.prefix}${i + 1}`;
                return (
                  <div key={id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: readinessChecks[id] ? `${cat.color}10` : 'transparent'
                  }}
                  onClick={() => toggleReadinessCheck(id)}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: `2px solid ${readinessChecks[id] ? cat.color : 'var(--border-color)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: readinessChecks[id] ? cat.color : 'transparent',
                      color: 'white'
                    }}>
                      {readinessChecks[id] && <FiCheck size={14} />}
                    </div>
                    <span style={{ 
                      fontSize: '0.9rem',
                      textDecoration: readinessChecks[id] ? 'line-through' : 'none',
                      color: readinessChecks[id] ? 'var(--text-secondary)' : 'var(--text-primary)'
                    }}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ 
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#b45309' }}>💡 Recommendations</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
            <li>Complete all required checklist items before applying</li>
            <li>Ensure financial statements are audited and up to date</li>
            <li>Document all policies and procedures</li>
            <li>Build partnerships and community relationships early</li>
            <li>Develop a strong M&E framework</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Button onClick={generateReadinessResult}>Generate Readiness Report</Button>
          <Button variant="outline" onClick={resetReadiness}>🔄 Reset</Button>
        </div>
      </div>
    );
  };

  // ============================================================
  // PROPOSAL CONTENT
  // ============================================================
  const renderProposalContent = () => {
    if (showResult && proposalResult) {
      return (
        <div>
          {renderProposalResult()}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Button onClick={handleDownloadProposal}><FiDownload /> Download PDF</Button>
            <Button variant="outline" onClick={() => window.print()}>🖨️ Print</Button>
            <Button variant="outline" onClick={resetProposal}>🔄 Start Over</Button>
            <Button variant="outline" onClick={() => { setShowResult(false); setProposalStep(1); }}>✏️ Edit</Button>
          </div>
        </div>
      );
    }

    const templates = [
      { id: 'concept', title: 'Concept Note', desc: '2-3 page summary', icon: '📄', sections: 7, color: '#4f46e5' },
      { id: 'full', title: 'Full Proposal', desc: '10-20 page document', icon: '📑', sections: 10, color: '#10b981' },
      { id: 'budget', title: 'Budget Template', desc: 'Detailed cost breakdown', icon: '💰', sections: 6, color: '#f59e0b' },
      { id: 'cover', title: 'Cover Letter', desc: 'Professional submission', icon: '✉️', sections: 4, color: '#8b5cf6' }
    ];

    const proposalSteps = [
      { id: 1, title: "Choose Template", icon: "📝" },
      { id: 2, title: "Write Content", icon: "✍️" },
      { id: 3, title: "Review & Submit", icon: "✅" }
    ];

    const proposalItems = [
      { id: 'research', label: 'Research the donor thoroughly' },
      { id: 'language', label: 'Use clear, concise language' },
      { id: 'examples', label: 'Provide specific examples' },
      { id: 'impact', label: 'Show impact, not just activities' },
      { id: 'budget', label: 'Be realistic in your budget' },
      { id: 'proofread', label: 'Proofread multiple times' }
    ];

    const resources = [
      { title: 'Proposal Writing Guide', icon: '📖', color: '#4f46e5' },
      { title: 'Sample Proposals', icon: '📄', color: '#10b981' },
      { title: 'Donor Research Tips', icon: '🔍', color: '#f59e0b' },
      { title: 'Budgeting Tools', icon: '💰', color: '#8b5cf6' }
    ];

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Step {proposalStep} of {proposalSteps.length}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {Math.round((proposalStep / proposalSteps.length) * 100)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
            <div style={{
              width: `${(proposalStep / proposalSteps.length) * 100}%`,
              height: '100%',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {proposalSteps.map((step) => (
            <div key={step.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backgroundColor: proposalStep >= step.id ? '#4f46e5' : 'var(--bg-subtle)',
              color: proposalStep >= step.id ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setProposalStep(step.id)}
            >
              <span>{step.icon}</span>
              <span style={{ fontSize: '0.85rem' }}>{step.title}</span>
            </div>
          ))}
        </div>

        {proposalStep === 1 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📝 Choose Your Proposal Template</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {templates.map((template) => (
                <div key={template.id} style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: `2px solid ${selectedTemplate === template.id ? template.color : 'var(--border-color)'}`,
                  backgroundColor: selectedTemplate === template.id ? `${template.color}10` : 'var(--bg-card)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => setSelectedTemplate(template.id)}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{template.icon}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{template.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{template.desc}</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--text-secondary)', 
                    marginTop: '0.5rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'inline-block'
                  }}>
                    {template.sections} sections
                  </div>
                  {selectedTemplate === template.id && (
                    <div style={{ marginTop: '0.5rem', color: template.color, fontWeight: 600, fontSize: '0.8rem' }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button onClick={() => setProposalStep(2)} disabled={!selectedTemplate}>
                Next: Write Content →
              </Button>
            </div>
          </div>
        )}

        {proposalStep === 2 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>✍️ Write Your Content</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Write your proposal content using the selected template:
              <strong style={{ marginLeft: '0.5rem', color: '#4f46e5' }}>
                {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.title : 'None selected'}
              </strong>
            </p>
            <textarea
              placeholder="Write your proposal content here..."
              value={proposalContent}
              onChange={(e) => setProposalContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}
            />
            <div style={{ marginTop: '1rem' }}>
              <Button variant="outline" onClick={() => setProposalStep(1)}>← Back</Button>
              <Button onClick={() => setProposalStep(3)}>Next: Review →</Button>
            </div>
          </div>
        )}

        {proposalStep === 3 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>✅ Review & Submit</h3>

            <h4 style={{ marginBottom: '0.5rem' }}>Checklist</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {proposalItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: proposalChecks[item.id] ? '#e8f5e9' : 'transparent'
                }}
                onClick={() => toggleProposalCheck(item.id)}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${proposalChecks[item.id] ? '#10b981' : 'var(--border-color)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: proposalChecks[item.id] ? '#10b981' : 'transparent',
                    color: 'white'
                  }}>
                    {proposalChecks[item.id] && <FiCheck size={12} />}
                  </div>
                  <span style={{ 
                    fontSize: '0.9rem',
                    textDecoration: proposalChecks[item.id] ? 'line-through' : 'none',
                    color: proposalChecks[item.id] ? 'var(--text-secondary)' : 'var(--text-primary)'
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <h4 style={{ marginBottom: '0.5rem' }}>📚 Resources</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {resources.map((resource, i) => (
                <div key={i} style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = resource.color}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <span style={{ fontSize: '1.5rem' }}>{resource.icon}</span>
                  <span style={{ fontSize: '0.9rem' }}>{resource.title}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="outline" onClick={() => setProposalStep(2)}>← Back</Button>
              <Button onClick={generateProposalResult}>Generate Summary</Button>
              <Button variant="outline" onClick={resetProposal}>🔄 Reset</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // MAIN RETURN
  // ============================================================

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Toolkits</h1>
          <p className={styles.pageSubtitle}>Practical tools to help your NGO plan strategically and effectively.</p>
        </div>
      </div>

      {!activeTool ? (
        <div className={styles.grid}>
        {tools.map(tool => (
          <Card key={tool.id} title={tool.title} outlineAction={true}>
            <div onClick={() => setActiveTool(tool.id)} style={{ height: '100%', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>{tool.icon}</span>
              </div>
              <p>{tool.description}</p>
              <div style={{ marginTop: '1rem' }}>
                <Button variant="outline" onClick={(e) => { e.stopPropagation(); setActiveTool(tool.id); }}>Open Builder</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      ) : (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <Button variant="outline" onClick={() => { setActiveTool(null); setShowResult(false); }}>← Back to Tools</Button>
          </div>
          <div className={styles.statCard} style={{ display: 'block', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{getTool(activeTool)?.icon}</span>
                {getTool(activeTool)?.title}
              </h2>
              <Button variant="outline" onClick={() => window.print()}><FiPrinter /> Print</Button>
            </div>
            
            {renderToolContent()}
            
          </div>
        </div>
      )}
    </Layout>
  );
}