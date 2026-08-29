import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FenceEstimateDetails, 
  BOMCalculation, 
  YardSegment, 
  FenceMaterialType, 
  FencePostType 
} from '../types';

const MATERIAL_NAMES: Record<FenceMaterialType, { name: string; tag: string }> = {
  cedar_privacy: {
    name: 'Western Red Cedar (Vertical Privacy)',
    tag: '#1 Grade Inland / Pacific Cedar'
  },
  cedar_modern: {
    name: 'Architectural Cedar (Horizontal Modern)',
    tag: 'Contemporary Craftsman Style'
  },
  vinyl_privacy: {
    name: 'Virgin Vinyl / PVC Privacy',
    tag: 'Zero-Maintenance Lifetime UV Protected'
  },
  ornamental_iron: {
    name: 'Ornamental Welded Steel / Iron',
    tag: 'Architectural Security & Pool Code'
  },
  chain_link: {
    name: 'Commercial Chain Link (Black Vinyl / Galvanized)',
    tag: 'Heavy-Duty 9-Gauge Perimeter Boundary'
  },
  composite_trex: {
    name: 'Trex Seclusions Composite',
    tag: 'Ultra-Premium Eco Wood-Plastic'
  }
};

const POST_NAMES: Record<FencePostType, string> = {
  postmaster_steel: 'Master Halco PostMaster+ (Hidden Steel, 80+ MPH Wind Rated)',
  cedar_4x4: '4x4 Western Red Cedar Posts',
  cedar_6x6: '6x6 Western Red Cedar Heavy Structural Posts',
  steel_pipe_bracket: 'Schedule 40 Galvanized Steel Pipe with Simpson WAP Brackets'
};

export interface GeneratePdfOptions {
  estimate: FenceEstimateDetails;
  bom: BOMCalculation;
  quoteId?: string;
  autoDownload?: boolean;
}

/**
 * Generates a high-quality, professional Contractor Proposal & Specification PDF
 * for 208 Fence and Gate LLC.
 */
export async function generateFenceEstimatePdf({
  estimate,
  bom,
  quoteId = '208-EST-DRAFT',
  autoDownload = true
}: GeneratePdfOptions): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter' // 612 x 792 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryNavy: [number, number, number] = [22, 30, 72];
  const accentBlue: [number, number, number] = [2, 132, 199];
  const slateText: [number, number, number] = [51, 65, 85];
  const lightBg: [number, number, number] = [248, 250, 252];
  const greenAccent: [number, number, number] = [5, 150, 105];

  // Helper to format currency
  const formatCurrency = (val: number) => `$${val.toLocaleString('en-US')}`;

  // ==========================================
  // 1. HEADER BANNER
  // ==========================================
  doc.setFillColor(...primaryNavy);
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Cyan Accent Line under header
  doc.setFillColor(...accentBlue);
  doc.rect(0, 90, pageWidth, 4, 'F');

  // Left Company Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('208 FENCE AND GATE LLC', margin, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(186, 230, 253);
  doc.text('Licensed Idaho Residential Contractor • Fence & Gate Automation Specialists', margin, 52);
  doc.text('Phone: (208) 358-9077  •  Email: admin@208fenceandgate.com  •  Boise, ID', margin, 66);
  doc.text('Serving: Boise • Meridian • Eagle • Nampa • Caldwell • Kuna • Star, Idaho', margin, 78);

  // Right Proposal Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(56, 189, 248);
  doc.text('OFFICIAL CONTRACTOR PROPOSAL', pageWidth - margin, 34, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`Reference: ${quoteId}`, pageWidth - margin, 48, { align: 'right' });

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Date: ${todayStr}  |  Valid: 30 Days (${validUntil})`, pageWidth - margin, 62, { align: 'right' });
  doc.text('Status: Verified Engineering Estimate', pageWidth - margin, 76, { align: 'right' });

  let currentY = 110;

  // ==========================================
  // 2. CLIENT & PROPERTY DETAILS BOX
  // ==========================================
  doc.setFillColor(...lightBg);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 68, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryNavy);
  doc.text('PREPARED FOR (PROPERTY OWNER):', margin + 12, currentY + 16);
  doc.text('PROJECT SITE LOCATION:', margin + contentWidth / 2 + 12, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateText);

  const clientName = estimate.customerName || 'Treasure Valley Homeowner';
  const clientPhone = estimate.customerPhone || 'On File / To Be Confirmed';
  const clientEmail = estimate.customerEmail || 'Not Provided';
  const address = estimate.projectAddress || 'Site Address Provided at Survey';
  const cityZip = [estimate.city, estimate.zipCode ? `ID ${estimate.zipCode}` : 'Treasure Valley, ID']
    .filter(Boolean)
    .join(', ');

  doc.text(`Name: ${clientName}`, margin + 12, currentY + 32);
  doc.text(`Phone: ${clientPhone}`, margin + 12, currentY + 46);
  doc.text(`Email: ${clientEmail}`, margin + 12, currentY + 60);

  doc.text(`Address: ${address}`, margin + contentWidth / 2 + 12, currentY + 32);
  doc.text(`Location: ${cityZip}`, margin + contentWidth / 2 + 12, currentY + 46);
  doc.text(`Terrain / Ground: ${estimate.terrain.replace('_', ' ').toUpperCase()}`, margin + contentWidth / 2 + 12, currentY + 60);

  currentY += 80;

  // ==========================================
  // 3. PROJECT SPECIFICATIONS OVERVIEW TABLE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryNavy);
  doc.text('1. ENGINEERING & SPECIFICATION SUMMARY', margin, currentY);
  currentY += 8;

  const matInfo = MATERIAL_NAMES[estimate.material] || { name: estimate.material, tag: '' };
  const postName = POST_NAMES[estimate.postType] || estimate.postType;

  const specData = [
    [
      { content: 'Primary Fence System:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      `${matInfo.name} (${matInfo.tag})`,
      { content: 'Total Linear Footage:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      `${bom.totalLinearFeet} Linear Feet (${estimate.heightFeet} ft Height)`
    ],
    [
      { content: 'Structural Post Specification:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      postName,
      { content: 'Post Spacing & Depths:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      `${estimate.postSpacingFeet} ft Centers • 36" Idaho Frost Depth Footings`
    ],
    [
      { content: 'Framing & Rot Board:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      `${estimate.railCount}-Rail Construction${estimate.hasRotBoard ? ' + 2x6 Ground Rot Board' : ''}`,
      { content: 'Cap & Trim Package:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      estimate.hasCapAndTrim ? 'Architectural 2x4 Cap & 1x2 Face Trim' : 'Standard Flush Top'
    ],
    [
      { content: 'Protective Finish / Stain:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      estimate.hasStaining ? `Oil-Based Stain (${estimate.stainColor || 'Natural Cedar'})` : 'Natural Unstained Wood',
      { content: 'Access Gates & Hardware:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      `${estimate.gates.singleGatesCount} Walk Gate(s) (${estimate.gates.singleGateWidthFt}ft), ${estimate.gates.doubleGatesCount} Drive Gate(s) (${estimate.gates.doubleGateWidthFt}ft)`
    ]
  ];

  if (estimate.gates.automatedSolarOperator) {
    specData.push([
      { content: 'Smart Gate Automation:', styles: { fontStyle: 'bold' as const, textColor: greenAccent } },
      'LiftMaster Heavy-Duty 30W Solar DC Operator Kit with Keypad & Dual Remotes',
      { content: 'Demolition / Tear-Out:', styles: { fontStyle: 'bold' as const, textColor: primaryNavy } },
      bom.tearOutCost > 0 ? `${estimate.tearOutFeet} LF Old Fence Demolition & Haul-away` : 'None Required'
    ]);
  }

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: specData,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      textColor: slateText,
      lineColor: [226, 232, 240],
      lineWidth: 0.5
    },
    columnStyles: {
      0: { cellWidth: 125, fillColor: [241, 245, 249] },
      1: { cellWidth: 145 },
      2: { cellWidth: 125, fillColor: [241, 245, 249] },
      3: { cellWidth: 145 }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 14;

  // ==========================================
  // 4. YARD SEGMENT BREAKDOWN & BILL OF MATERIALS TABLE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryNavy);
  doc.text('2. YARD SEGMENTS & MATERIALS BREAKDOWN (BOM)', margin, currentY);
  currentY += 8;

  const segmentRows = estimate.segments.map((seg: YardSegment, idx: number) => [
    `Segment ${idx + 1}: ${seg.name}`,
    `${seg.lengthFeet} LF`,
    `${seg.singleGates} Walk Gate${seg.singleGates === 1 ? '' : 's'}`,
    `${seg.doubleGates} Drive Gate${seg.doubleGates === 1 ? '' : 's'}`,
    seg.hasTearOut ? 'Yes (Demolition & Haul)' : 'Clear / New Install'
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Fence Segment Line', 'Length', 'Walk Gates', 'Drive Gates', 'Tear-Out Required']],
    body: segmentRows,
    theme: 'striped',
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 4
    },
    styles: {
      fontSize: 8,
      cellPadding: 3.5,
      textColor: slateText
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Materials & Hardware counts
  const bomRows = [
    ['Structural Posts (Centers + Gates)', `${bom.totalPostCount} Posts (${postName.split(' ')[0]})`, 'Fasteners & Hardware', `${bom.fastenersCountLbs} lbs Ring-Shank Nails / Screws`],
    ['Concrete Footings (60lb Bags)', `${bom.concreteBagsCount} Bags (High-Strength 4000 PSI)`, 'Walk Gate Hardware Kits', `${bom.singleGateKits} Heavy-Duty Adjustable Frame Kit(s)`],
    ['Horizontal Rails (2x4 Construction)', `${bom.railCount} Rails (Western Red Cedar)`, 'Double Drive Gate Kits', `${bom.doubleGateKits} Steel-Reinforced Drive Kit(s)`],
    ['Privacy Pickets (5.5" Width)', `${bom.picketCount} Pickets (Selected Grade)`, 'Gate Automation Kit', bom.automatedOperatorUnits > 0 ? '1 Solar DC Motor + Keypad' : 'Manual Latch System']
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Bill of Materials (BOM)', 'Quantity / Spec', 'Hardware & Accessories', 'Quantity / Spec']],
    body: bomRows,
    theme: 'plain',
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: primaryNavy,
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 3
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: slateText,
      lineColor: [241, 245, 249],
      lineWidth: 0.5
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 14;

  // ==========================================
  // 5. ITEMIZED CONTRACT INVESTMENT BREAKDOWN
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryNavy);
  doc.text('3. ITEMIZED CONTRACT INVESTMENT BREAKDOWN', margin, currentY);
  currentY += 8;

  const costRows = [
    ['Fence Materials, Structural Lumber & Hardware:', formatCurrency(bom.materialsCost)],
    ['Professional Installation, Auger Digging & Post Alignment:', formatCurrency(bom.laborCost)],
  ];

  if (bom.tearOutCost > 0) {
    costRows.push(['Existing Fence Demolition, Removal & Landfill Haul-Away:', formatCurrency(bom.tearOutCost)]);
  }

  if (bom.gatesCost > 0) {
    costRows.push(['Custom Gates, Heavy-Duty Hardware & Automation Operators:', formatCurrency(bom.gatesCost)]);
  }

  if (bom.addonsCost > 0) {
    costRows.push(['Enhancement Package (Stain / Rot Board / Cap & Trim):', formatCurrency(bom.addonsCost)]);
  }

  costRows.push(['Idaho State Sales Tax (6.0% on materials only):', formatCurrency(bom.tax)]);
  costRows.push([
    { content: 'TOTAL CONTRACT PROPOSAL INVESTMENT:', styles: { fontStyle: 'bold' as const, fontSize: 10, textColor: primaryNavy } },
    { content: formatCurrency(bom.totalCost), styles: { fontStyle: 'bold' as const, fontSize: 11, textColor: accentBlue } }
  ]);

  costRows.push([
    { content: `Estimated Financing (84 Months @ 7.99% APR, $0 Down):`, styles: { fontStyle: 'italic' as const, fontSize: 8, textColor: greenAccent } },
    { content: `Starting at $${bom.monthlyFinancingPayment}/month`, styles: { fontStyle: 'bold' as const, fontSize: 8.5, textColor: greenAccent } }
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: costRows,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      textColor: slateText,
      lineColor: [226, 232, 240],
      lineWidth: 0.5
    },
    columnStyles: {
      0: { cellWidth: contentWidth - 110 },
      1: { cellWidth: 110, halign: 'right' }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // ==========================================
  // 6. CONTRACTOR GUARANTEES & TERMS
  // ==========================================
  if (currentY > pageHeight - 140) {
    doc.addPage();
    currentY = margin;
  }

  doc.setFillColor(...lightBg);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 54, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryNavy);
  doc.text('208 FENCE & GATE STANDARD GUARANTEES & OPERATIONAL PROTOCOL:', margin + 8, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateText);
  doc.text('• 10-Year Workmanship Warranty against post lean, structural failure, and gate sag under normal Idaho wind conditions.', margin + 8, currentY + 23);
  doc.text('• 811 DigLine Underground Utility Locate is called and verified by contractor 48 hours before digging begins.', margin + 8, currentY + 33);
  doc.text('• Concrete set to 36" depth below frost line for every post to prevent frost-heaving during Treasure Valley winter freezes.', margin + 8, currentY + 43);

  currentY += 64;

  // ==========================================
  // 7. SIGNATURE / PROPOSAL ACCEPTANCE BLOCK
  // ==========================================
  if (currentY > pageHeight - 90) {
    doc.addPage();
    currentY = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryNavy);
  doc.text('PROPOSAL AUTHORIZATION & ACCEPTANCE:', margin, currentY);
  currentY += 8;

  const sigBoxWidth = (contentWidth - 16) / 2;

  // Client Signature Line
  doc.setDrawColor(148, 163, 184);
  doc.line(margin, currentY + 26, margin + sigBoxWidth, currentY + 26);
  doc.line(margin + sigBoxWidth - 70, currentY + 26, margin + sigBoxWidth, currentY + 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateText);
  doc.text('Property Owner / Client Signature', margin, currentY + 35);
  doc.text('Date', margin + sigBoxWidth - 65, currentY + 35);

  // Contractor Signature Line
  doc.line(margin + sigBoxWidth + 16, currentY + 26, margin + contentWidth, currentY + 26);
  doc.text('208 Fence and Gate LLC Authorized Representative', margin + sigBoxWidth + 16, currentY + 35);
  doc.text('Date', margin + contentWidth - 65, currentY + 35);

  // ==========================================
  // 8. FOOTER
  // ==========================================
  const footerY = pageHeight - 20;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('208 Fence and Gate LLC • Licensed Idaho Contractor • admin@208fenceandgate.com • (208) 358-9077', margin, footerY);
  doc.text(`Proposal Ref: ${quoteId} • Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });

  // Download Trigger
  if (autoDownload) {
    const filename = `208-Fence-Estimate-${quoteId.replace(/[^a-zA-Z0-9-_]/g, '')}.pdf`;
    doc.save(filename);
  }

  return doc;
}
