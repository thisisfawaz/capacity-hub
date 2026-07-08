"use client";

import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, Button } from "@/components/Card";
import fundingData from "@/data/funding.json";
import styles from "../page.module.css";
import { FiFilter, FiDollarSign, FiCalendar, FiMapPin, FiCheckCircle, FiSend } from "react-icons/fi";
import { askAIAssistant } from "@/utils/aiService";

export default function FundingHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  
  // Chat state
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Grant Assistant. Ask me anything about the grants listed here, or ask for help drafting a proposal!" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Search and Filter logic
  const filteredFunding = fundingData.filter(fund => {
    const matchesSearch = 
      fund.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRegion = 
      selectedRegion === "All Regions" || 
      fund.country.toLowerCase().includes(selectedRegion.toLowerCase()) ||
      fund.country === "Global";
      
    const matchesSector = 
      selectedSector === "All Sectors" || 
      fund.sector.toLowerCase().includes(selectedSector.toLowerCase()) ||
      fund.sector === "Multiple";

    return matchesSearch && matchesRegion && matchesSector;
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isAsking) return;

    const userMessage = { role: "user", content: inputVal };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputVal("");
    setIsAsking(true);

    try {
      // Pass the current filters context to the AI system so it knows what they are viewing
      const contextPrompt = `
      User is currently searching for: "${searchTerm}"
      Region Filter: "${selectedRegion}"
      Sector Filter: "${selectedSector}"
      Listed grants matching filters: ${filteredFunding.map(f => f.title).join(", ")}
      `;

      const aiPayload = [
        { role: "system", content: `Context of user's screen: ${contextPrompt}` },
        ...updatedMessages
      ];

      const res = await askAIAssistant(aiPayload);
      setMessages([...updatedMessages, { role: "assistant", content: res.message }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "assistant", content: "Error: Failed to fetch response. Please verify your DEEPSEEK_API_KEY in the .env file." }]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Funding Hub</h1>
          <p className={styles.pageSubtitle}>Search real funding opportunities, filter by project type, and chat with your AI assistant.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
        
        {/* Left Filters Panel */}
        <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <div className={styles.statCard} style={{ display: 'block', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiFilter /> Filters</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Search Keywords</label>
              <input 
                type="text" 
                placeholder="e.g. Health, Climate, Innovation" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }} 
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Target Region</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none' }}
              >
                <option>All Regions</option>
                <option>Global</option>
                <option>Africa Region</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Funding Sector</label>
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none' }}
              >
                <option>All Sectors</option>
                <option>Healthcare</option>
                <option>Climate Action</option>
                <option>Social Justice & Education</option>
                <option>Agriculture & Energy</option>
              </select>
            </div>
          </div>
          
          <div className={styles.statCard} style={{ display: 'block', padding: '1.5rem', backgroundColor: '#fde8e9', border: 'none' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Funding Readiness</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Assess your proposal design standards before applying.</p>
            <Button variant="outline" style={{ width: '100%', backgroundColor: 'white' }} onClick={() => window.location.href='/assessments/pra-1'}>Take Readiness Quiz</Button>
          </div>
        </div>

        {/* Center Grants List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '0.5rem' }}>
          {filteredFunding.length > 0 ? (
            filteredFunding.map(fund => (
              <div key={fund.id} className={styles.statCard} style={{ display: 'block', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{fund.title}</h2>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                      {fund.category}
                    </span>
                  </div>
                  <Button variant="outline" onClick={() => alert("Opportunity Saved!")}>Save Opportunity</Button>
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiDollarSign /> {fund.amount}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiCalendar /> {fund.deadline}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiMapPin /> {fund.country}</span>
                </div>

                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{fund.description}</p>
                
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Eligibility Requirements:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                    {fund.eligibility.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <FiCheckCircle color="var(--success-color)" style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.875rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                    <strong>Pro Tip:</strong> {fund.tips}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.statCard} style={{ display: 'block', padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No funding opportunities match your active search terms or filters. Try adjusting your settings.
            </div>
          )}
        </div>

        {/* Right AI Chatbox Panel */}
        <div className={styles.statCard} style={{ width: '320px', flexShrink: 0, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>AI Grant Assistant</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Powered by DeepSeek</span>
          </div>

          {/* Conversation history */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'var(--bg-subtle)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)'
                }}
              >
                {msg.content}
              </div>
            ))}
            {isAsking && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '0.75rem', borderRadius: '12px', fontSize: '0.875rem', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Assistant is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Send Input form */}
          <form onSubmit={handleSendMessage} style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Ask about these grants..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
              disabled={isAsking}
            />
            <button 
              type="submit" 
              style={{ padding: '0.6rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              disabled={isAsking}
            >
              <FiSend />
            </button>
          </form>
        </div>

      </div>
    </Layout>
  );
}
