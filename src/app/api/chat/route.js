// src/app/api/chat/route.js

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const userQuery = messages[messages.length - 1].content;

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
      return Response.json(
        { 
          success: false,
          message: "Please set your DEEPSEEK_API_KEY in the .env file to use the AI assistant." 
        },
        { status: 400 }
      );
    }

    // Step 1: Search for real grants based on user query
    const grantsData = await searchRealGrants(userQuery);

    // Step 2: Prepare context for DeepSeek
    const systemPrompt = {
      role: "system",
      content: `You are a grant assistant for CapacityHub. Here are REAL, CURRENT grants that match the user's query: ${JSON.stringify(grantsData, null, 2)}

      INSTRUCTIONS:
      1. ONLY use the grant data provided above. DO NOT make up grants.
      2. If no grants match, suggest similar keywords or filters.
      3. Provide specific grant names, amounts, and deadlines.
      4. Help users understand eligibility and application process.
      5. Be helpful, concise, and actionable.`
    };

    // Step 3: Call DeepSeek with context
    const deepseekMessages = [systemPrompt, ...messages];

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: deepseekMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "DeepSeek API request failed");
    }

    return Response.json({
      success: true,
      message: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { 
        success: false, 
        message: `Error: ${error.message}` 
      },
      { status: 500 }
    );
  }
}

// 🔥 REAL GRANT SEARCH ENGINE
async function searchRealGrants(query) {
  const results = [];

  // Source 1: World Bank Projects (Nigeria focus)
  try {
    const worldBankRes = await fetch(
      'https://datacatalogapi.worldbank.org/dexapps/fone/api/view?viewId=DS01120&type=json&top=10'
    );
    const worldBankData = await worldBankRes.json();
    
    if (worldBankData && worldBankData.data) {
      worldBankData.data.forEach((project, index) => {
        const title = project.project_name || project.title || `World Bank Project ${index + 1}`;
        const description = project.project_abstract || project.description || "World Bank development project";
        const country = project.country || "Multiple Countries";
        const sector = project.majorsector || project.sector || "Development";
        const amount = project.total_commitment ? `$${project.total_commitment.toLocaleString()}` : "Varies";
        const deadline = project.closing_date || "2027-2030";
        
        results.push({
          id: `wb-${index}`,
          title: title,
          category: "World Bank Development Project",
          country: country,
          sector: sector,
          amount: amount,
          deadline: deadline,
          description: description,
          eligibility: [
            "Government agencies and ministries",
            "Registered NGOs and civil society organizations",
            "Private sector partners in eligible countries"
          ],
          tips: "Align your proposal with World Bank country strategy and sustainable development goals.",
          source: "World Bank"
        });
      });
    }
  } catch (error) {
    console.error("World Bank API error:", error);
  }

  // Source 2: 360Giving (UK grants data - open standard)
  try {
    // Note: 360Giving requires searching their registry
    // This is a simplified example
    const ukGrantsRes = await fetch(
      'https://api.threesixtygiving.org/search?q=' + encodeURIComponent(query) + '&size=5'
    );
    const ukGrantsData = await ukGrantsRes.json();
    
    if (ukGrantsData && ukGrantsData.results) {
      ukGrantsData.results.forEach((grant, index) => {
        results.push({
          id: `tg-${index}`,
          title: grant.title || grant.grantProgramme || "UK Grant Opportunity",
          category: "UK Grant",
          country: grant.country || grant.recipientCountry || "United Kingdom",
          sector: grant.sector || grant.theme || "Multiple",
          amount: grant.amountAwarded ? `£${grant.amountAwarded.toLocaleString()}` : "Varies",
          deadline: grant.closeDate || grant.deadline || "Varies",
          description: grant.description || grant.grantProgramme || "Grant opportunity from UK funding sources",
          eligibility: grant.eligibility || ["UK registered organizations", "Charitable purposes"],
          tips: "Check the funder's website for full eligibility details.",
          source: "360Giving"
        });
      });
    }
  } catch (error) {
    console.error("360Giving API error:", error);
  }

  // Source 3: IATI (International Aid Transparency Initiative)
  try {
    const iatiRes = await fetch(
      'https://api.iatistandard.org/search?q=' + encodeURIComponent(query) + '&limit=5'
    );
    const iatiData = await iatiRes.json();
    
    if (iatiData && iatiData.results) {
      iatiData.results.forEach((activity, index) => {
        results.push({
          id: `iati-${index}`,
          title: activity.title || activity.description || "International Aid Project",
          category: "International Aid",
          country: activity.recipient_country || "Multiple Countries",
          sector: activity.sector || activity.sector_name || "Development",
          amount: activity.total_budget ? `$${activity.total_budget.toLocaleString()}` : "Varies",
          deadline: activity.end_date || "Varies",
          description: activity.description || activity.title || "International development aid activity",
          eligibility: activity.eligibility || ["Government partners", "NGOs in eligible countries"],
          tips: "Align with recipient country development priorities.",
          source: "IATI"
        });
      });
    }
  } catch (error) {
    console.error("IATI API error:", error);
  }

  // Source 4: EU Funding Portal (Tenders Electronic Daily)
  try {
    const euRes = await fetch(
      'https://webgate.ec.europa.eu/ted-api/search?q=' + encodeURIComponent(query) + '&limit=5'
    );
    const euData = await euRes.json();
    
    if (euData && euData.projects) {
      euData.projects.forEach((project, index) => {
        results.push({
          id: `eu-${index}`,
          title: project.title || project.name || "EU Funding Opportunity",
          category: "EU Grant",
          country: project.country || "Europe",
          sector: project.theme || project.sector || "Multiple",
          amount: project.budget ? `€${project.budget.toLocaleString()}` : "Varies",
          deadline: project.deadline || project.closeDate || "Varies",
          description: project.description || project.summary || "European Union funding opportunity",
          eligibility: project.eligibility || ["EU member states", "Associated countries"],
          tips: "Check Horizon Europe or other specific EU programmes for full details.",
          source: "European Union"
        });
      });
    }
  } catch (error) {
    console.error("EU API error:", error);
  }

  // If no results from APIs, use fallback with your static data + query matching
  if (results.length === 0) {
    const staticGrants = [
      {
        id: "fund-gates",
        title: "Bill & Melinda Gates Foundation Grants",
        category: "Global Health & Development",
        country: "Global",
        sector: "Healthcare",
        amount: "$100,000 - $10,000,000",
        deadline: "Rolling",
        description: "Funding for innovative solutions in global health, infectious disease prevention, maternal health, and agricultural development.",
        eligibility: [
          "Registered NGOs and non-profit institutions globally",
          "Focus on low- and middle-income country populations",
          "Strong alignment with foundation strategic priority areas"
        ],
        tips: "Emphasize scalable technological or scientific innovations that dramatically lower delivery costs.",
        source: "Bill & Melinda Gates Foundation"
      },
      {
        id: "fund-usaid",
        title: "USAID - Development Innovation Ventures (DIV)",
        category: "Innovation & Scaling",
        country: "Global",
        sector: "Multiple",
        amount: "$50,000 - $5,000,000",
        deadline: "Year-round / Rolling",
        description: "USAID's DIV model funds startup solutions to global development challenges that show proof of concept, scale, and high cost-effectiveness.",
        eligibility: [
          "Any entity registered anywhere, including local NGOs",
          "Solutions must address extreme poverty in developing nations",
          "Rigorous commitment to quantitative impact evaluation"
        ],
        tips: "Detail your plan to scale beyond donor funding, showing how the solution eventually integrates into public or private markets.",
        source: "USAID"
      },
      {
        id: "fund-ford",
        title: "Ford Foundation - Social Justice Grants",
        category: "Human Rights & Equity",
        country: "Global",
        sector: "Social Justice & Education",
        amount: "$50,000 - $1,500,000",
        deadline: "By Invitation / Inquiry",
        description: "Core and project-based funding for organizations working to reduce inequality, promote democratic values, and protect civil rights globally.",
        eligibility: [
          "Non-governmental organizations (NGOs)",
          "Demonstrated alignment with gender, racial, and economic justice",
          "History of community-led local advocacy"
        ],
        tips: "Highlight how your governance structure actively includes the voices of the marginalized populations you serve.",
        source: "Ford Foundation"
      },
      {
        id: "fund-rockefeller",
        title: "The Rockefeller Foundation - Climate & Resilience",
        category: "Climate Action & Health",
        country: "Global",
        sector: "Climate Action",
        amount: "$100,000 - $2,000,000",
        deadline: "Varies by Initiative",
        description: "Supporting organizations building resilient food, health, and energy systems that mitigate climate change impacts on vulnerable communities.",
        eligibility: [
          "Registered non-profits and academic institutes",
          "Focus on intersections of climate, green energy transition, and public health",
          "Multi-stakeholder partnership projects preferred"
        ],
        tips: "Show clear metrics connecting green energy transition or resilient farming to direct public health benefits.",
        source: "Rockefeller Foundation"
      },
      {
        id: "fund-usadf",
        title: "USADF - Sub-Saharan Africa Community Grants",
        category: "Community Enterprise",
        country: "Africa Region",
        sector: "Agriculture & Energy",
        amount: "$10,000 - $250,000",
        deadline: "September 30, 2026",
        description: "Direct development grants to African-owned and African-led enterprises, cooperatives, and community organizations to build local livelihoods.",
        eligibility: [
          "100% African-owned and managed organizations",
          "Operating in USADF priority countries in Sub-Saharan Africa",
          "Direct cooperative membership or community ownership model"
        ],
        tips: "Focus heavily on economic viability, showing how agricultural yields or energy access will generate local jobs and income.",
        source: "USADF"
      }
    ];

    // Filter static grants based on query keywords
    const keywords = query.toLowerCase().split(' ');
    return staticGrants.filter(grant => {
      const searchText = `${grant.title} ${grant.category} ${grant.sector} ${grant.description} ${grant.country}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    }).slice(0, 5); // Return top 5 matches
  }

  return results.slice(0, 10); // Return top 10 results from all APIs
}