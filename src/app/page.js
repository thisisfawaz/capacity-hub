"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import styles from "./page.module.css";
import { 
  FiBook, FiVideo, FiFileText, FiUsers, FiTrendingUp,
  FiCalendar, FiClock, FiAward, FiGlobe, FiArrowRight,
  FiStar, FiZap, FiBarChart2, FiLayers, FiTarget,
  FiMessageCircle, FiDownload, FiShare2, FiHeart,
  FiTool, FiPackage, FiBox
} from "react-icons/fi";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Resource data
  const resources = {
    totalResources: 156,
    categories: 12,
    countries: 45,
    recentResources: [
      { 
        title: "Introduction to NGO Governance", 
        type: "Module", 
        duration: "45 mins", 
        level: "Beginner", 
        popular: true,
        link: "/learning?topic=lm-1"
      },
      { 
        title: "Financial Management for Nonprofits", 
        type: "Module", 
        duration: "1 hour 30 mins", 
        level: "Intermediate", 
        popular: true,
        link: "/learning?topic=lm-2"
      },
      { 
        title: "Program Design and Impact Measurement", 
        type: "Module", 
        duration: "1 hour 30 mins", 
        level: "Intermediate", 
        popular: false,
        link: "/learning?topic=lm-3"
      },
    ],
    categoryList: [
      { name: "Grant Writing", icon: "✍️", count: 28 },
      { name: "Proposal Development", icon: "📝", count: 32 },
      { name: "M&E Frameworks", icon: "📊", count: 18 },
      { name: "Financial Management", icon: "💰", count: 15 },
      { name: "Sustainability Planning", icon: "🌱", count: 12 },
      { name: "Impact Measurement", icon: "🎯", count: 20 },
    ],
    trendingTopics: [
      { name: "AI in Grant Writing", link: "/knowledge/ai-grant-writing" },
      { name: "Climate Finance", link: "/knowledge/climate-finance" },
      { name: "Social Impact Measurement", link: "/knowledge/social-impact-measurement" },
      { name: "Gender-Responsive Budgeting", link: "/knowledge/gender-responsive-budgeting" },
      { name: "Digital Storytelling", link: "/knowledge/digital-storytelling" },
    ]
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, iconColor }) => (
    <div style={{ 
      padding: isMobile ? '1rem' : '1.5rem', 
      borderRadius: '16px', 
      background: gradient || 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          padding: '0.6rem', 
          borderRadius: '12px', 
          background: iconColor || 'rgba(99, 102, 241, 0.15)',
          color: iconColor || '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={isMobile ? 20 : 24} />
        </div>
        <div>
          <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </div>
          <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {isLoading ? '...' : value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Hero Section with Learning Theme */}
      <div style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)',
        borderRadius: '20px',
        padding: isMobile ? '1.5rem' : '3rem',
        marginBottom: '1.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1rem' : '0' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FiBook size={isMobile ? 20 : 28} />
                <span style={{ fontWeight: 600, fontSize: isMobile ? '0.7rem' : '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
                  Learning Hub
                </span>
              </div>
              <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Welcome to the Resource Centre
              </h1>
              <p style={{ fontSize: isMobile ? '0.85rem' : '1.1rem', opacity: 0.9, maxWidth: '550px' }}>
                Your gateway to knowledge on grant writing, proposal development, 
                and sustainable project management.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ 
                fontSize: isMobile ? '0.7rem' : '0.8rem', 
                opacity: 0.8,
                background: 'rgba(255,255,255,0.15)',
                padding: '0.3rem 0.6rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <FiGlobe size={isMobile ? 12 : 14} /> {resources.countries} countries
              </span>
              <a 
                href="/planning"
                style={{ 
                  padding: isMobile ? '0.4rem 1rem' : '0.5rem 1.25rem', 
                  borderRadius: '30px', 
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <FiTool size={isMobile ? 14 : 16} /> Toolkits
              </a>
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-5%',
          width: isMobile ? '200px' : '350px',
          height: isMobile ? '200px' : '350px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40%',
          left: '10%',
          width: isMobile ? '150px' : '250px',
          height: isMobile ? '150px' : '250px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Quick Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: isMobile ? '0.75rem' : '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <StatCard 
          icon={FiBook}
          title="Total Resources"
          value={resources.totalResources}
          gradient="linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
          iconColor="#10b981"
        />
        <StatCard 
          icon={FiLayers}
          title="Categories"
          value={resources.categories}
          gradient="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
          iconColor="#3b82f6"
        />
        <StatCard 
          icon={FiGlobe}
          title="Countries"
          value={resources.countries}
          gradient="linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
          iconColor="#f59e0b"
        />
        <StatCard 
          icon={FiPackage}
          title="Toolkits"
          value={5}
          gradient="linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)"
          iconColor="#8b5cf6"
        />
      </div>

      {/* Main Content - 2 Columns on Desktop, 1 on Mobile */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recent Resources */}
          <div style={{ 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiTrendingUp color="#4f46e5" /> Recent Resources
              </h3>
              <Link href="/learning" style={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem', 
                color: '#4f46e5', 
                textDecoration: 'none',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'gap 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.gap = '0.5rem'}
              onMouseLeave={(e) => e.currentTarget.style.gap = '0.25rem'}
              >
                View all <FiArrowRight size={isMobile ? 12 : 14} />
              </Link>
            </div>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Loading resources...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {resources.recentResources.map((resource, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: i % 2 === 0 ? 'var(--bg-subtle)' : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                    gap: isMobile ? '0.5rem' : '0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg-subtle)' : 'transparent'}
                  >
                    <div style={{ flex: 1, minWidth: isMobile ? '100%' : 'auto' }}>
                      <div style={{ fontWeight: 500, fontSize: isMobile ? '0.85rem' : '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {resource.title}
                        {resource.popular && (
                          <span style={{ 
                            fontSize: '0.5rem', 
                            fontWeight: 600,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '20px',
                            background: '#fef3c7',
                            color: '#b45309'
                          }}>
                            Popular
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: isMobile ? '0.65rem' : '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span>📄 {resource.type}</span>
                        <span>⏱️ {resource.duration}</span>
                        <span>📊 {resource.level}</span>
                      </div>
                    </div>
                    <Link href={resource.link || "#"} style={{ textDecoration: 'none' }}>
                      <button style={{ 
                        padding: isMobile ? '0.3rem 0.6rem' : '0.4rem 0.8rem', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#4f46e5';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#4f46e5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }}
                      >
                        View →
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Categories - Desktop: in Left Column, Mobile: Last */}
          <div style={{ 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            transition: 'all 0.2s ease',
            order: isMobile ? 3 : 0
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiTarget color="#7c3aed" /> Learning Categories
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(140px, 1fr))', gap: isMobile ? '0.5rem' : '0.75rem' }}>
              {resources.categoryList.map((category, i) => (
                <div key={i} style={{ 
                  padding: isMobile ? '0.5rem' : '0.75rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4f46e5';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                >
                  <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '0.15rem' }}>{category.icon}</div>
                  <div style={{ fontSize: isMobile ? '0.7rem' : '0.85rem', fontWeight: 500 }}>{category.name}</div>
                  <div style={{ fontSize: isMobile ? '0.6rem' : '0.7rem', opacity: 0.7 }}>{category.count} resources</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Trending Topics */}
          <div style={{ 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            transition: 'all 0.2s ease'
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiZap color="#f59e0b" /> 🔥 Trending Topics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {resources.trendingTopics.map((topic, i) => (
                <Link 
                  key={i} 
                  href={topic.link}
                  style={{ 
                    textDecoration: 'none',
                    display: 'block'
                  }}
                >
                  <div style={{ 
                    padding: isMobile ? '0.5rem 0.75rem' : '0.6rem 0.75rem',
                    borderRadius: '10px',
                    backgroundColor: i % 2 === 0 ? 'var(--bg-subtle)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef3c7'}
                  onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg-subtle)' : 'transparent'}
                  >
                    <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>#{i + 1}</span>
                    <span style={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>{topic.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Start Planning Section */}
          <div style={{ 
            padding: isMobile ? '1rem' : '1.5rem', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white'
          }}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiTool /> Start Planning
            </h3>
            <p style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', opacity: 0.9, marginBottom: '1rem' }}>
              Use our toolkits to build your project strategy.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: '0.5rem' }}>
              <a 
                href="/planning?tab=swot"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: isMobile ? '0.5rem' : '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '0.75rem' : '0.9rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <FiTool size={isMobile ? 14 : 16} /> SWOT Builder
              </a>
              <a 
                href="/planning?tab=toc"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: isMobile ? '0.5rem' : '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '0.75rem' : '0.9rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiTool size={isMobile ? 14 : 16} /> Theory of Change
              </a>
              <a 
                href="/planning?tab=risk"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: isMobile ? '0.5rem' : '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '0.75rem' : '0.9rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiTool size={isMobile ? 14 : 16} /> Risk Assessment
              </a>
              <a 
                href="/planning?tab=readiness"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: isMobile ? '0.5rem' : '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '0.75rem' : '0.9rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiTool size={isMobile ? 14 : 16} /> Grant Readiness
              </a>
              <a 
                href="/planning?tab=proposal"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: isMobile ? '0.5rem' : '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontSize: isMobile ? '0.75rem' : '0.9rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiTool size={isMobile ? 14 : 16} /> Proposal Writing
              </a>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}