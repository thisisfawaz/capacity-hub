"use client";

import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, Button } from "@/components/Card";
import styles from "../page.module.css";
import { FiFilter, FiDollarSign, FiCalendar, FiMapPin, FiCheckCircle, FiSend, FiRefreshCw, FiSearch, FiExternalLink } from "react-icons/fi";
import { askAIAssistant } from "@/utils/aiService";

// Helper function to format AI responses
const formatAIMessage = (text) => {
  if (!text) return '';
  
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    const trimmed = line.trim();
    const isListItem = /^[-*]/.test(trimmed) || /^\d+\./.test(trimmed);
    
    let htmlContent = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlContent = htmlContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    if (isListItem) {
      const text = htmlContent.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
      return (
        <div key={index} style={{ 
          paddingLeft: '1.5rem', 
          marginBottom: '0.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <span>•</span>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      );
    }
    
    if (/^#/.test(trimmed)) {
      const text = htmlContent.replace(/^#+\s*/, '');
      const level = trimmed.match(/^#+/)[0].length;
      const fontSize = level === 1 ? '1.5rem' : level === 2 ? '1.25rem' : '1.1rem';
      const fontWeight = level === 1 ? 700 : 600;
      return (
        <h3 key={index} style={{ 
          fontSize: fontSize, 
          fontWeight: fontWeight,
          marginBottom: '0.75rem',
          marginTop: '1.25rem'
        }}>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </h3>
      );
    }
    
    return (
      <p 
        key={index} 
        style={{ 
          marginBottom: '0.75rem', 
          lineHeight: '1.8',
          marginTop: 0
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  });
};

export default function FundingHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [fundingData, setFundingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Chat state
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your Grant Assistant. Ask me about real, current grants from around the world!\n\nYou can ask me:\n- **About specific grants**\n- **How to apply**\n- **Eligibility criteria**\n- **Tips for successful proposals**" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load REAL grants from API only (no static fallback)
  const loadRealGrants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/grants');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch grants: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.grants.length > 0) {
        setFundingData(data.grants);
      } else {
        setError("No grants found. Please try again later.");
        setFundingData([]);
      }
    } catch (error) {
      console.error("Failed to load grants:", error);
      setError("Failed to load grant data. Please check your internet connection and try again.");
      setFundingData([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load grants on mount
  useEffect(() => {
    loadRealGrants();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRealGrants();
  };

  // Handle Search and Filter logic
  const filteredFunding = fundingData.filter(fund => {
    const matchesSearch = 
      fund.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.sector?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRegion = 
      selectedRegion === "All Regions" || 
      fund.country?.toLowerCase().includes(selectedRegion.toLowerCase()) ||
      fund.country === "Global";
      
    const matchesSector = 
      selectedSector === "All Sectors" || 
      fund.sector?.toLowerCase().includes(selectedSector.toLowerCase()) ||
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
      const contextPrompt = `
      User is asking: "${inputVal}"
      Current search filter: "${searchTerm || 'None'}"
      Region Filter: "${selectedRegion}"
      Sector Filter: "${selectedSector}"
      Available real grants in the system: ${fundingData.map(f => f.title).join(", ")}
      
      IMPORTANT: The user wants REAL, CURRENT grant data. If you don't have specific grants matching their query, search your knowledge or provide general guidance on where to find such grants.
      `;

      const aiPayload = [
        { role: "system", content: `You are a grant assistant for CapacityHub. You help users find REAL funding opportunities. ${contextPrompt}` },
        ...updatedMessages
      ];

      const res = await askAIAssistant(aiPayload);
      setMessages([...updatedMessages, { role: "assistant", content: res.message }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "assistant", content: "Error: Failed to fetch response. Please check your internet connection and try again." }]);
    } finally {
      setIsAsking(false);
    }
  };

  // Real URLs for each grant source
  const getGrantUrl = (fund) => {
    if (fund.url) return fund.url;
    
    const source = fund.source?.toLowerCase() || '';
    
    if (source.includes('gates') || source.includes('bill')) {
      return 'https://www.gatesfoundation.org/our-work/programs/global-health';
    } else if (source.includes('usaid')) {
      return 'https://www.usaid.gov/div';
    } else if (source.includes('ford')) {
      return 'https://www.fordfoundation.org/work/grants';
    } else if (source.includes('rockefeller')) {
      return 'https://www.rockefellerfoundation.org/our-work/';
    } else if (source.includes('usadf')) {
      return 'https://www.usadf.gov/grants';
    } else if (source.includes('world bank')) {
      return 'https://www.worldbank.org/en/projects-operations';
    } else if (source.includes('african development')) {
      return 'https://www.afdb.org/en/projects-and-operations';
    } else {
      return `https://www.google.com/search?q=${encodeURIComponent(fund.title + ' grant funding ' + fund.source)}`;
    }
  };

  // Check if mobile
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
      const checkScreenSize = () => {
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);
      };
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

  return (
    <Layout>
      <div className={styles.pageHeader} style={{ 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '1rem' : '0'
      }}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>Funding Hub</h1>
          <p className={styles.pageSubtitle} style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>
            Search real funding opportunities from around the world, filter by project type, and chat with your AI assistant.
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: isMobile ? 'flex-start' : 'auto' }}
        >
          <FiRefreshCw className={isRefreshing ? styles.spinning : ''} /> 
          {isRefreshing ? 'Refreshing...' : 'Refresh Grants'}
        </Button>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107', 
          color: '#856404', 
          padding: '0.75rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          fontSize: isMobile ? '0.85rem' : '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* TOP FILTERS BAR - Mobile Responsive */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '0.75rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: isMobile ? '100%' : 'auto' }}>
          <FiFilter size={16} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filters</span>
        </div>
        
        <input 
          type="text" 
          placeholder="Search keywords..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            flex: isMobile ? 'none' : 1,
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '120px',
            padding: '0.4rem 0.75rem', 
            borderRadius: '6px', 
            border: '1px solid var(--border-color)', 
            outline: 'none',
            backgroundColor: 'var(--bg-color)',
            fontSize: '0.8rem'
          }} 
        />
        
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{ 
            width: isMobile ? '100%' : 'auto',
            padding: '0.4rem 0.75rem', 
            borderRadius: '6px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--bg-color)', 
            outline: 'none',
            fontSize: '0.8rem',
            minWidth: isMobile ? 'auto' : '100px'
          }}
        >
          <option>All Regions</option>
          <option>Global</option>
          <option>Africa Region</option>
          <option>North America</option>
          <option>Europe</option>
          <option>Asia</option>
          <option>South America</option>
        </select>
        
        <select 
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          style={{ 
            width: isMobile ? '100%' : 'auto',
            padding: '0.4rem 0.75rem', 
            borderRadius: '6px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--bg-color)', 
            outline: 'none',
            fontSize: '0.8rem',
            minWidth: isMobile ? 'auto' : '100px'
          }}
        >
          <option>All Sectors</option>
          <option>Healthcare</option>
          <option>Climate Action</option>
          <option>Social Justice & Education</option>
          <option>Agriculture & Energy</option>
          <option>Technology & Innovation</option>
          <option>Economic Development</option>
        </select>

        <div style={{ 
          padding: '0.2rem 0.75rem', 
          borderRadius: '6px', 
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap'
        }}>
          {fundingData.length} grants
        </div>

        <button 
          onClick={() => window.location.href='/assessments/pra-1'}
          style={{ 
            padding: '0.4rem 0.9rem', 
            borderRadius: '6px', 
            border: 'none',
            backgroundColor: '#fde8e9',
            color: 'var(--primary-color)',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s ease',
            width: isMobile ? '100%' : 'auto'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          📋 Readiness Quiz
        </button>
      </div>

      {/* 2-COLUMN LAYOUT - Mobile Responsive */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        height: isMobile ? 'auto' : 'calc(100vh - 320px)',
        overflow: isMobile ? 'visible' : 'hidden',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        
        {/* LEFT: Grants List */}
        <div style={{ 
          flex: isMobile ? 'none' : '0 0 35%',
          height: isMobile ? '400px' : 'auto',
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem', 
          paddingRight: isMobile ? '0' : '0.25rem' 
        }}>
          {isLoading ? (
            <div className={styles.statCard} style={{ display: 'block', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ 
                fontSize: '2rem', 
                animation: 'swing 1.5s ease-in-out infinite', 
                display: 'inline-block', 
                transformOrigin: 'right center' 
              }}>
                <FiSearch />
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.1rem' }}>Searching for grants...</div>
              {/* Inline keyframe definition */}
              <style>{`
                @keyframes swing {
                  0% { transform: rotate(-25deg); }
                  50% { transform: rotate(25deg); }
                  100% { transform: rotate(-25deg); }
                }
              `}</style>
            </div>
          ) : filteredFunding.length > 0 ? (
            filteredFunding.map(fund => (
              <div key={fund.id || fund.title} className={styles.statCard} style={{ display: 'block', padding: isMobile ? '0.75rem' : '0.75rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a 
                      href={getGrantUrl(fund)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        textDecoration: 'none', 
                        color: 'var(--text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    >
                      <h4 style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', margin: 0, fontWeight: 600 }}>{fund.title}</h4>
                      <FiExternalLink size={isMobile ? 10 : 12} style={{ opacity: 0.6, flexShrink: 0 }} />
                    </a>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                      <span style={{ padding: '1px 6px', borderRadius: '3px', fontSize: isMobile ? '0.5rem' : '0.55rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                        {fund.category || 'Grant'}
                      </span>
                      {fund.source && (
                        <span style={{ padding: '1px 6px', borderRadius: '3px', fontSize: isMobile ? '0.45rem' : '0.5rem', backgroundColor: '#e3f2fd', border: '1px solid #90caf9', fontWeight: 500 }}>
                          {fund.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" style={{ fontSize: isMobile ? '0.5rem' : '0.6rem', padding: isMobile ? '0.1rem 0.4rem' : '0.15rem 0.5rem', flexShrink: 0, marginLeft: '0.5rem' }} onClick={() => alert("Saved!")}>Save</Button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', fontSize: isMobile ? '0.55rem' : '0.65rem', color: 'var(--text-secondary)', fontWeight: 500, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><FiDollarSign size={isMobile ? 8 : 10} /> {fund.amount || 'Varies'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><FiCalendar size={isMobile ? 8 : 10} /> {fund.deadline || 'Varies'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><FiMapPin size={isMobile ? 8 : 10} /> {fund.country || 'Global'}</span>
                </div>

                <p style={{ marginTop: '0.25rem', marginBottom: 0, lineHeight: '1.4', fontSize: isMobile ? '0.65rem' : '0.75rem', color: 'var(--text-secondary)' }}>
                  {fund.description.length > (isMobile ? 80 : 100) ? fund.description.substring(0, isMobile ? 80 : 100) + '...' : fund.description}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.statCard} style={{ display: 'block', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem' }}>🔎</div>
              <h4 style={{ margin: '0.5rem 0' }}>No grants found</h4>
              <p style={{ fontSize: '0.8rem' }}>Adjust filters or refresh</p>
            </div>
          )}
        </div>

        {/* RIGHT: AI Chatbox Panel - Mobile Responsive */}
        <div className={styles.statCard} style={{ 
          flex: isMobile ? 'none' : 1,
          height: isMobile ? '450px' : 'auto',
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '0px solid var(--border-color)', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: isMobile ? '0.9rem' : '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🤖 Grant Assistant</h3>
            <span style={{ fontSize: isMobile ? '0.6rem' : '0.7rem', color: 'var(--text-secondary)' }}>Ask about grants, eligibility, or proposal tips</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  padding: isMobile ? '0.5rem 0.6rem' : '0.6rem 0.8rem',
                  borderRadius: '12px',
                  fontSize: isMobile ? '0.8rem' : '0.85rem',
                  backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'var(--bg-subtle)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)'
                }}
              >
                {msg.role === 'assistant' ? formatAIMessage(msg.content) : msg.content}
              </div>
            ))}
            {isAsking && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '0.6rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Assistant is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <input 
                type="text" 
                placeholder="Ask about grants..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: isMobile ? '0.5rem 0.75rem' : isTablet ? '0.6rem 1rem' : '0.8rem 1.2rem',
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)', 
                  fontSize: isMobile ? '0.85rem' : isTablet ? '0.9rem' : '1rem',
                  outline: 'none',
                  backgroundColor: 'var(--bg-color)',
                  minHeight: isMobile ? '40px' : isTablet ? '44px' : '52px',
                  minWidth: isMobile ? '260px' : isTablet ? '340px' : '540px',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
                disabled={isAsking}
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                padding: isMobile ? '0.4rem 0.6rem' : isTablet ? '0.5rem 0.8rem' : '0.7rem 1rem',
                borderRadius: '8px', 
                border: 'none', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                flexShrink: 0,
                minWidth: isMobile ? '40px' : isTablet ? '44px' : '52px',
                minHeight: isMobile ? '40px' : isTablet ? '44px' : '52px'
              }}
              disabled={isAsking}
            >
              <FiSend size={isMobile ? 16 : isTablet ? 17 : 20} />
            </button>
          </form>
        </div>

      </div>
    </Layout>
  );
}