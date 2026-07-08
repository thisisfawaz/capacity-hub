// src/app/api/grants/route.js

export async function GET() {
  try {
    const grants = await fetchRealGrants();
    
    if (grants.length === 0) {
      return Response.json({
        success: false,
        grants: [],
        count: 0,
        message: "No real grants found. Please try again later.",
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      grants: grants,
      count: grants.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    return Response.json({
      success: false,
      grants: [],
      error: error.message
    }, { status: 500 });
  }
}

async function fetchRealGrants() {
  const allGrants = [];

  // ============================================================
  // 1. WORLD BANK - Real Projects
  // ============================================================
  try {
    const response = await fetch(
      'https://search.worldbank.org/api/v2/projects?format=json&countrycode=NG&rows=10'
    );
    const data = await response.json();
    
    if (data && data.projects) {
      Object.values(data.projects).forEach((project) => {
        if (project.project_name) {
          allGrants.push({
            id: `wb-${project.id || Date.now()}-${Math.random()}`,
            title: project.project_name || "World Bank Project",
            url: `https://projects.worldbank.org/en/projects-operations/project-detail/${project.id || ''}`,
            category: project.major_sector || "Development",
            country: project.country || "Nigeria",
            sector: project.major_sector || project.sector || "Development",
            amount: project.total_commitment ? `$${Number(project.total_commitment).toLocaleString()}` : "Varies",
            deadline: project.closing_date || project.expected_end_date || "Varies",
            description: project.project_abstract || project.description || "World Bank funded development project.",
            eligibility: [
              "Government agencies and ministries",
              "Registered NGOs and civil society organizations",
              "Private sector partners"
            ],
            tips: "Align with World Bank country strategy and SDGs.",
            source: "World Bank",
            isReal: true
          });
        }
      });
    }
  } catch (error) {
    console.error("World Bank API error:", error);
  }

  // ============================================================
  // 2. IATI - International Aid Data (Real)
  // ============================================================
  try {
    const response = await fetch(
      'https://api.iatistandard.org/search?q=nigeria&limit=10'
    );
    const data = await response.json();
    
    if (data && data.results) {
      data.results.forEach((activity) => {
        if (activity.title || activity.description) {
          allGrants.push({
            id: `iati-${activity.id || Date.now()}-${Math.random()}`,
            title: activity.title || activity.description || "International Aid Project",
            url: activity.url || `https://iatistandard.org/en/`,
            category: activity.sector_name || "International Aid",
            country: activity.recipient_country || "Nigeria",
            sector: activity.sector || activity.sector_name || "Development",
            amount: activity.total_budget ? `$${Number(activity.total_budget).toLocaleString()}` : "Varies",
            deadline: activity.end_date || "Varies",
            description: activity.description || activity.title || "International development aid activity.",
            eligibility: [
              "Government partners",
              "NGOs in eligible countries",
              "International organizations"
            ],
            tips: "Align with recipient country development priorities.",
            source: "IATI",
            isReal: true
          });
        }
      });
    }
  } catch (error) {
    console.error("IATI API error:", error);
  }

  // ============================================================
  // 3. EU Funding - Tenders Electronic Daily (Real)
  // ============================================================
  try {
    const response = await fetch(
      'https://webgate.ec.europa.eu/ted-api/search?q=development&limit=10'
    );
    const data = await response.json();
    
    if (data && data.projects) {
      data.projects.forEach((project) => {
        if (project.title || project.name) {
          allGrants.push({
            id: `eu-${project.id || Date.now()}-${Math.random()}`,
            title: project.title || project.name || "EU Funding Opportunity",
            url: project.url || `https://ec.europa.eu/`,
            category: "EU Grant",
            country: project.country || "Europe",
            sector: project.theme || project.sector || "Multiple",
            amount: project.budget ? `€${Number(project.budget).toLocaleString()}` : "Varies",
            deadline: project.deadline || project.closeDate || "Varies",
            description: project.description || project.summary || "European Union funding opportunity.",
            eligibility: [
              "EU member states",
              "Associated countries",
              "Specific criteria may apply"
            ],
            tips: "Check Horizon Europe or other specific EU programmes for full details.",
            source: "European Union",
            isReal: true
          });
        }
      });
    }
  } catch (error) {
    console.error("EU API error:", error);
  }

  // ============================================================
  // NO FALLBACK DATA - Return only what was fetched
  // ============================================================
  
  // Deduplicate
  const uniqueGrants = [];
  const titles = new Set();
  for (const grant of allGrants) {
    if (!titles.has(grant.title)) {
      titles.add(grant.title);
      uniqueGrants.push(grant);
    }
  }

  return uniqueGrants.slice(0, 20);
}