import React, { useState } from 'react';
import { Scale, Check, X, Info } from 'lucide-react';

export default function SchemeCompare() {
  const [selectedScheme1, setSelectedScheme1] = useState('pmegp');
  const [selectedScheme2, setSelectedScheme2] = useState('mudra');

  const schemes = [
    { id: 'pmegp', name: 'PMEGP' },
    { id: 'standup', name: 'Stand-Up India' },
    { id: 'mudra', name: 'MUDRA Yojana' },
    { id: 'startup', name: 'Startup India Seed Fund' },
  ];

  const schemeDetails = {
    'pmegp': {
      name: 'Prime Minister Employment Generation Programme',
      maxLoan: '₹50 Lakhs (Mfg) / ₹20 Lakhs (Service)',
      subsidy: '15% to 35% (Margin Money)',
      interestRate: 'Normal Bank Rates (9% - 11%)',
      collateral: 'No Collateral up to ₹10 Lakhs',
      eligibility: '8th Pass (for >10L loan). Any new enterprise.',
      target: 'Unemployed youth, Artisans, SC/ST/Women/Minorities',
      agency: 'KVIC / DIC',
      processingTime: '4 - 8 Weeks'
    },
    'standup': {
      name: 'Stand-Up India Scheme',
      maxLoan: '₹10 Lakhs to ₹1 Crore',
      subsidy: 'No upfront subsidy. Credit Guarantee available.',
      interestRate: 'MCLR + 3% + Tenor Premium (lowest applicable)',
      collateral: 'No Collateral (CGSSI coverage)',
      eligibility: 'Must be SC/ST or Woman Entrepreneur.',
      target: 'Greenfield projects only (First time venture)',
      agency: 'SIDBI / All Scheduled Commercial Banks',
      processingTime: '3 - 6 Weeks'
    },
    'mudra': {
      name: 'Pradhan Mantri Mudra Yojana (PMMY)',
      maxLoan: 'Up to ₹10 Lakhs (Shishu, Kishore, Tarun)',
      subsidy: 'No Subsidy. Pure Credit.',
      interestRate: '8% - 12% (Varies by Bank)',
      collateral: 'No Collateral required for any amount',
      eligibility: 'Any individual with a business plan.',
      target: 'Micro enterprises, Shopkeepers, Vendors',
      agency: 'Micro Units Development & Refinance Agency',
      processingTime: '1 - 3 Weeks'
    },
    'startup': {
      name: 'Startup India Seed Fund Scheme',
      maxLoan: '₹20 Lakhs (Proof of Concept) / ₹50 Lakhs (Commercial)',
      subsidy: 'Grant for PoC. Debt for Commercialization.',
      interestRate: 'Subsidized. Moratorium up to 1 year.',
      collateral: 'No Collateral',
      eligibility: 'DPIIT Recognized Startup (< 2 years old)',
      target: 'Tech and Innovative Startups',
      agency: 'DPIIT / Incubators',
      processingTime: '8 - 12 Weeks'
    }
  };

  const scheme1 = schemeDetails[selectedScheme1];
  const scheme2 = schemeDetails[selectedScheme2];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span className="badge" style={{ background: "#dbeafe", color: "#2563eb", border: "1px solid #93c5fd" }}>Decision Tool</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          Scheme Comparison
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
          Compare schemes side-by-side to find the best match for your business
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: '600' }}>Scheme 1</label>
          <select 
            value={selectedScheme1} 
            onChange={(e) => setSelectedScheme1(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937', fontSize: '14px' }}
          >
            {schemes.map(s => <option key={`1-${s.id}`} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: '600' }}>Scheme 2</label>
          <select 
            value={selectedScheme2} 
            onChange={(e) => setSelectedScheme2(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937', fontSize: '14px' }}
          >
            {schemes.map(s => <option key={`2-${s.id}`} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '20%', padding: '20px', textAlign: 'left', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', color: '#4b5563', fontWeight: '700' }}>Features</th>
              <th style={{ width: '40%', padding: '20px', textAlign: 'left', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', color: '#1f2937', fontSize: '16px' }}>{scheme1.name}</th>
              <th style={{ width: '40%', padding: '20px', textAlign: 'left', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', color: '#1f2937', fontSize: '16px' }}>{scheme2.name}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'maxLoan', label: 'Max Loan Amount' },
              { key: 'subsidy', label: 'Subsidy / Grant' },
              { key: 'collateral', label: 'Collateral Required' },
              { key: 'interestRate', label: 'Interest Rate' },
              { key: 'eligibility', label: 'Key Eligibility' },
              { key: 'target', label: 'Target Beneficiaries' },
              { key: 'processingTime', label: 'Avg Processing Time' },
              { key: 'agency', label: 'Nodal Agency' }
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx !== 7 ? '1px solid #e5e7eb' : 'none' }}>
                <td style={{ padding: '16px 20px', backgroundColor: '#f9fafb', borderRight: '1px solid #e5e7eb', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                  {row.label}
                </td>
                <td style={{ padding: '16px 20px', borderRight: '1px solid #e5e7eb', color: '#4b5563', fontSize: '14px', verticalAlign: 'top' }}>
                  {scheme1[row.key]}
                </td>
                <td style={{ padding: '16px 20px', color: '#4b5563', fontSize: '14px', verticalAlign: 'top' }}>
                  {scheme2[row.key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
