import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Briefcase, Printer, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useFarmer } from '../context/FarmerContext';

export default function DPRGenerator() {
  const { profile } = useFarmer();
  
  const [formData, setFormData] = useState({
    businessName: `${profile?.name || 'Entrepreneur'} Enterprises`,
    promoterName: profile?.name || "Rajesh Kumar",
    industry: profile?.business_type || "Manufacturing",
    projectCost: profile?.project_cost || 2500000,
    machineryCost: (profile?.project_cost || 2500000) * 0.6,
    workingCapital: (profile?.project_cost || 2500000) * 0.4,
    promoterContributionPct: profile?.social_category === 'SC' || profile?.social_category === 'ST' || profile?.is_women ? 5 : 10,
    subsidyPct: profile?.social_category === 'SC' || profile?.social_category === 'ST' ? 35 : 25,
    loanInterestRate: 10,
    loanTenureYears: 5,
    expectedRevenueYear1: 3000000,
    expectedProfitMargin: 15,
  });

  useEffect(() => {
    if (profile && !generated) {
      setFormData(prev => ({
        ...prev,
        businessName: `${profile.name} Enterprises`,
        promoterName: profile.name,
        industry: profile.business_type || "Service",
        projectCost: profile.project_cost || 500000,
        machineryCost: (profile.project_cost || 500000) * 0.6,
        workingCapital: (profile.project_cost || 500000) * 0.4,
        promoterContributionPct: profile.social_category === 'SC' || profile.social_category === 'ST' || profile.is_women ? 5 : 10,
        subsidyPct: profile.social_category === 'SC' || profile.social_category === 'ST' ? 35 : 25,
      }));
    }
  }, [profile]);

  const [generated, setGenerated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'number' ? Number(value) : value
    });
  };

  const generateDPR = () => {
    setGenerated(true);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('dpr-report-content');
    const opt = {
      margin:       0.5,
      filename:     `${formData.businessName.replace(/\s+/g, '_')}_DPR.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const promoterContribution = (formData.projectCost * formData.promoterContributionPct) / 100;
  const subsidyAmount = (formData.projectCost * formData.subsidyPct) / 100;
  const bankLoan = formData.projectCost - promoterContribution - subsidyAmount;

  // Simple EMI Calculation
  const r = formData.loanInterestRate / 12 / 100;
  const n = formData.loanTenureYears * 12;
  const emi = bankLoan > 0 ? (bankLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const annualLoanRepayment = emi * 12;

  const y1Profit = (formData.expectedRevenueYear1 * formData.expectedProfitMargin) / 100;
  const y2Profit = ((formData.expectedRevenueYear1 * 1.15) * formData.expectedProfitMargin) / 100;
  const y3Profit = ((formData.expectedRevenueYear1 * 1.30) * formData.expectedProfitMargin) / 100;

  const dscrY1 = (y1Profit + annualLoanRepayment) / annualLoanRepayment;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span className="badge" style={{ background: "#dbeafe", color: "#2563eb", border: "1px solid #93c5fd" }}>Financial Planning</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          Bankable DPR Generator
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
          Generate a detailed project report to apply for bank loans and subsidies
        </p>
      </div>

      {!generated ? (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '20px' }}>Project Parameters</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Business Name</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Promoter Name</label>
              <input type="text" name="promoterName" value={formData.promoterName} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Industry / Sector</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Total Project Cost (₹)</label>
              <input type="number" name="projectCost" value={formData.projectCost} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Machinery / Equipment Cost (₹)</label>
              <input type="number" name="machineryCost" value={formData.machineryCost} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Working Capital Required (₹)</label>
              <input type="number" name="workingCapital" value={formData.workingCapital} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Promoter Contribution (%)</label>
              <input type="number" name="promoterContributionPct" value={formData.promoterContributionPct} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Expected Subsidy (%)</label>
              <input type="number" name="subsidyPct" value={formData.subsidyPct} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Loan Interest Rate (%)</label>
              <input type="number" name="loanInterestRate" value={formData.loanInterestRate} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>Expected Year 1 Revenue (₹)</label>
              <input type="number" name="expectedRevenueYear1" value={formData.expectedRevenueYear1} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }} />
            </div>
          </div>
          
          <button 
            onClick={generateDPR}
            style={{ marginTop: '24px', backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}
          >
            <FileText size={18} /> Generate Detailed Project Report
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '16px' }} className="dpr-no-print">
            <button style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }} onClick={() => window.print()}>
              <Printer size={16} /> Print
            </button>
            <button style={{ background: '#10b981', border: 'none', padding: '8px 16px', borderRadius: '6px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }} onClick={handleExportPDF}>
              <Download size={16} /> Export PDF
            </button>
            <button style={{ background: '#334155', border: 'none', padding: '8px 16px', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: '600' }} onClick={() => setGenerated(false)}>
              Edit
            </button>
          </div>

          <div id="dpr-report-content" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>DETAILED PROJECT REPORT</h1>
              <p style={{ fontSize: '16px', color: '#64748b', marginTop: '4px' }}>Bankable DPR for Loan Processing</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>1. Project Profile</h3>
              <table style={{ width: '100%', fontSize: '14px' }}>
                <tbody>
                  <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Name of Enterprise:</td><td style={{ fontWeight: '600', textAlign: 'right' }}>{formData.businessName}</td></tr>
                  <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Promoter/Director:</td><td style={{ fontWeight: '600', textAlign: 'right' }}>{formData.promoterName}</td></tr>
                  <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Industry/Sector:</td><td style={{ fontWeight: '600', textAlign: 'right' }}>{formData.industry}</td></tr>
                  <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Constitution:</td><td style={{ fontWeight: '600', textAlign: 'right' }}>Proprietorship/LLP</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>2. Project Costing</h3>
              <table style={{ width: '100%', fontSize: '14px' }}>
                <tbody>
                  <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Machinery & Eqp:</td><td style={{ fontWeight: '600', textAlign: 'right' }}>₹{formData.machineryCost.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Working Capital (Margin):</td><td style={{ fontWeight: '600', textAlign: 'right' }}>₹{formData.workingCapital.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Other Fixed Assets:</td><td style={{ fontWeight: '600', textAlign: 'right' }}>₹{(formData.projectCost - formData.machineryCost - formData.workingCapital).toLocaleString()}</td></tr>
                  <tr><td style={{ padding: '6px 0', color: '#0f172a', fontWeight: '700' }}>Total Project Cost:</td><td style={{ fontWeight: '800', textAlign: 'right', color: '#0f172a' }}>₹{formData.projectCost.toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>3. Means of Finance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Promoter Contribution ({formData.promoterContributionPct}%)</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#334155', marginTop: '8px' }}>₹{promoterContribution.toLocaleString()}</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '1px solid #d1fae5', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#047857', fontWeight: '600', textTransform: 'uppercase' }}>Govt Subsidy ({formData.subsidyPct}%)</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669', marginTop: '8px' }}>₹{subsidyAmount.toLocaleString()}</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: '600', textTransform: 'uppercase' }}>Bank Loan Required</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', marginTop: '8px' }}>₹{bankLoan.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>4. Financial Projections (3 Years)</h3>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#475569', fontWeight: '700' }}>Particulars</th>
                  <th style={{ padding: '10px', textAlign: 'right', color: '#475569', fontWeight: '700' }}>Year 1</th>
                  <th style={{ padding: '10px', textAlign: 'right', color: '#475569', fontWeight: '700' }}>Year 2</th>
                  <th style={{ padding: '10px', textAlign: 'right', color: '#475569', fontWeight: '700' }}>Year 3</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: '500' }}>Expected Gross Revenue</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>₹{formData.expectedRevenueYear1.toLocaleString()}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>₹{(formData.expectedRevenueYear1 * 1.15).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>₹{(formData.expectedRevenueYear1 * 1.3).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: '500' }}>Net Profit (PAT)</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>₹{y1Profit.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>₹{y2Profit.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>₹{y3Profit.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: '500' }}>Loan Repayment (Annual)</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626' }}>₹{annualLoanRepayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626' }}>₹{annualLoanRepayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626' }}>₹{annualLoanRepayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', fontWeight: '700' }}>DSCR (Debt Service Coverage Ratio)</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: '700', color: dscrY1 >= 1.5 ? '#059669' : '#d97706' }}>{dscrY1.toFixed(2)}x</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: '700', color: '#059669' }}>{((y2Profit + annualLoanRepayment)/annualLoanRepayment).toFixed(2)}x</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: '700', color: '#059669' }}>{((y3Profit + annualLoanRepayment)/annualLoanRepayment).toFixed(2)}x</td>
                </tr>
              </tbody>
            </table>
            
            {dscrY1 >= 1.5 ? (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', color: '#047857', fontSize: '14px', fontWeight: '600' }}>
                <CheckCircle size={18} /> Project is Financially Viable & Bankable (DSCR &gt; 1.5x).
              </div>
            ) : (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', color: '#b45309', fontSize: '14px', fontWeight: '600' }}>
                Project DSCR is low ({dscrY1.toFixed(2)}x). Banks typically require &gt; 1.5x. Consider increasing revenue or promoter contribution.
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#94a3b8' }}>
            Report generated by Entre Help Platform
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
