import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Await params to support modern Next.js versions cleanly
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Define template data
    const templates = {
      'grant-proposal-template': {
        name: 'Grant Proposal Template',
        data: [
          ['GRANT PROPOSAL TEMPLATE'],
          ['Project Title:', 'Enter your project title here'],
          ['Organization:', 'Enter your organization name'],
          ['Location:', 'Enter project location'],
          ['Duration:', 'Enter project duration'],
          [],
          ['EXECUTIVE SUMMARY'],
          ['Summary:', 'Write a brief summary of your project (max 200 words)'],
          [],
          ['PROBLEM STATEMENT'],
          ['Problem:', 'Describe the problem you are addressing'],
          ['Beneficiaries:', 'Who will benefit from this project?'],
          [],
          ['PROJECT OBJECTIVES'],
          ['Objective 1:', 'Enter objective 1'],
          ['Objective 2:', 'Enter objective 2'],
          ['Objective 3:', 'Enter objective 3'],
          [],
          ['BUDGET'],
          ['Category', 'Amount (USD)'],
          ['Personnel Costs', 0],
          ['Activities', 0],
          ['Materials & Equipment', 0],
          ['Travel', 0],
          ['Administrative', 0],
          ['Total', 0]
        ]
      },
      'project-budget-template': {
        name: 'Project Budget Template',
        data: [
          ['PROJECT BUDGET'],
          ['Project Title:', 'Enter project title'],
          ['Budget Period:', 'Start Date - End Date'],
          [],
          ['PERSONNEL COSTS'],
          ['Position', 'Name', 'Rate', 'Months', 'Total'],
          ['Project Manager', '', 0, 0, 0],
          ['Finance Officer', '', 0, 0, 0],
          ['Field Staff', '', 0, 0, 0],
          ['TOTAL PERSONNEL', '', '', '', 0],
          [],
          ['ACTIVITY COSTS'],
          ['Activity', 'Description', 'Location', 'Cost'],
          ['Activity 1', '', '', 0],
          ['Activity 2', '', '', 0],
          ['TOTAL ACTIVITIES', '', '', 0],
          [],
          ['BUDGET SUMMARY'],
          ['Category', 'Amount'],
          ['Personnel', 0],
          ['Activities', 0],
          ['Materials', 0],
          ['Travel', 0],
          ['Total', 0]
        ]
      },
      'concept-note-template': {
        name: 'Concept Note Template',
        data: [
          ['CONCEPT NOTE'],
          ['Date:', new Date().toLocaleDateString()],
          ['Project Title:', 'Enter project title'],
          ['Organization:', 'Enter organization name'],
          ['Contact:', 'Enter contact person'],
          [],
          ['1. INTRODUCTION'],
          ['Background:', 'Describe the background and context'],
          [],
          ['2. PROBLEM STATEMENT'],
          ['Problem:', 'Clearly state the problem your project addresses'],
          [],
          ['3. TARGET BENEFICIARIES'],
          ['Beneficiaries:', 'Describe who will benefit'],
          [],
          ['4. PROJECT OBJECTIVES'],
          ['Objective 1:', 'Enter objective 1'],
          ['Objective 2:', 'Enter objective 2'],
          [],
          ['5. ESTIMATED BUDGET'],
          ['Category', 'Amount (USD)'],
          ['Personnel', 0],
          ['Activities', 0],
          ['Materials', 0],
          ['Total', 0]
        ]
      },
      'me-framework-template': {
        name: 'M&E Framework Template',
        data: [
          ['M&E FRAMEWORK'],
          ['Project Title:', 'Enter project title'],
          ['Goal:', 'Enter project goal'],
          [],
          ['LOGICAL FRAMEWORK'],
          ['Level', 'Description', 'Indicator', 'Means of Verification'],
          ['Goal', 'Enter goal', 'Goal indicator', 'How to verify'],
          ['Purpose', 'Enter purpose', 'Purpose indicator', 'How to verify'],
          ['Output 1', 'Output 1', 'Output 1 indicator', 'How to verify'],
          ['Output 2', 'Output 2', 'Output 2 indicator', 'How to verify'],
          [],
          ['INDICATOR TRACKING'],
          ['Indicator', 'Baseline', 'Target', 'Data Source', 'Frequency'],
          ['Indicator 1', 'Baseline', 'Target', 'Source', 'Monthly'],
          ['Indicator 2', 'Baseline', 'Target', 'Source', 'Quarterly']
        ]
      },
      'project-plan-template': {
        name: 'Project Plan Template',
        data: [
          ['PROJECT PLAN'],
          ['Project Title:', 'Enter project title'],
          ['Start Date:', 'Enter start date'],
          ['End Date:', 'Enter end date'],
          [],
          ['ACTIVITY SCHEDULE'],
          ['Activity', 'Start', 'End', 'Duration', 'Responsible'],
          ['Activity 1', '', '', '', ''],
          ['Activity 2', '', '', '', ''],
          ['Activity 3', '', '', '', ''],
          [],
          ['RISK MATRIX'],
          ['Risk', 'Likelihood', 'Impact', 'Mitigation'],
          ['Risk 1', 'Low/High', 'Low/High', 'Mitigation strategy'],
          ['Risk 2', 'Low/High', 'Low/High', 'Mitigation strategy']
        ]
      },
      'funding-assessment-checklist': {
        name: 'Funding Assessment Checklist',
        data: [
          ['FUNDING ASSESSMENT CHECKLIST'],
          ['Organization:', 'Enter organization name'],
          ['Date:', new Date().toLocaleDateString()],
          [],
          ['ORGANIZATIONAL READINESS'],
          ['Requirement', 'Status', 'Comments'],
          ['Clear Mission Statement', 'Yes/No', ''],
          ['Registered Legal Status', 'Yes/No', ''],
          ['Board of Directors', 'Yes/No', ''],
          ['Financial Management System', 'Yes/No', ''],
          [],
          ['SCORING'],
          ['Category', 'Score (1-5)'],
          ['Organizational Readiness', 0],
          ['Project Readiness', 0],
          ['Financial Management', 0],
          ['Overall Score', 0]
        ]
      }
    };

    // Get the template
    const template = templates[id];
    if (!template) {
      return NextResponse.json({ 
        error: 'Template not found',
        requestedId: id,
        availableIds: Object.keys(templates)
      }, { status: 404 });
    }

    // Generate CSV content
    let csvContent = '';
    template.data.forEach(row => {
      // Convert row to CSV string with quotes
      const csvRow = row.map(cell => {
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',');
      csvContent += csvRow + '\n';
    });

    // Return the file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${id}.csv"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate template: ' + error.message 
    }, { status: 500 });
  }
}