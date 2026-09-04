import React, { useState } from 'react';
import { ClipboardCheck, FileX, FileCheck, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export default function ApplicationAuditor() {
  const [selectedScheme, setSelectedScheme] = useState('');
  
  // Hardcoded for demo purposes, could be fetched from API
  const schemesList = [
    { id: 'pmegp', name: 'Prime Minister Employment Generation Programme (PMEGP)' },
    { id: 'standup', name: 'Stand-Up India' },
    { id: 'mudra', name: 'Pradhan Mantri Mudra Yojana (PMMY)' }
  ];

  const schemeDocuments = {
    'pmegp': [
      { id: 'aadhaar', name: 'Aadhaar Card', mandatory: true, status: 'missing', desc: 'Required for E-KYC' },
      { id: 'pan', name: 'PAN Card', mandatory: true, status: 'missing', desc: 'Income Tax mapping' },
      { id: 'caste', name: 'Caste/Category Certificate', mandatory: false, status: 'missing', desc: 'Required only for SC/ST/OBC subsidies' },
      { id: 'project_report', name: 'Detailed Project Report (DPR)', mandatory: true, status: 'missing', desc: 'Bankable report with means of finance' },
      { id: 'education', name: 'Education Certificate (8th Pass+)', mandatory: true, status: 'missing', desc: 'For projects > Rs 10 Lakh' }
    ],
    'standup': [
      { id: 'aadhaar', name: 'Aadhaar Card', mandatory: true, status: 'missing', desc: 'Required for E-KYC' },
      { id: 'caste', name: 'SC/ST Certificate', mandatory: true, status: 'missing', desc: 'Must be issued by competent authority' },
      { id: 'project_report', name: 'Detailed Project Report (DPR)', mandatory: true, status: 'missing', desc: 'Bankable report with means of finance' },
      { id: 'bank_stmt', name: '6 Month Bank Statement', mandatory: true, status: 'missing', desc: 'Proof of non-defaulter status' }
    ],
    'mudra': [
      { id: 'aadhaar', name: 'Aadhaar Card', mandatory: true, status: 'missing', desc: 'Required for E-KYC' },
      { id: 'address', name: 'Proof of Address', mandatory: true, status: 'missing', desc: 'Voter ID / Utility Bill' },
      { id: 'quotation', name: 'Machinery Quotations', mandatory: true, status: 'missing', desc: 'For assets to be purchased' },
      { id: 'udyam', name: 'Udyam Registration', mandatory: true, status: 'missing', desc: 'MSME registration certificate' }
    ]
  };

  const [docs, setDocs] = useState([]);

  const handleSchemeSelect = (e) => {
    const val = e.target.value;
    setSelectedScheme(val);
    if (val && schemeDocuments[val]) {
      setDocs(schemeDocuments[val].map(d => ({ ...d, status: 'missing' })));
    } else {
      setDocs([]);
    }
  };

  const toggleDocStatus = (id) => {
    setDocs(docs.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === 'missing' ? 'uploaded' : 'missing' };
      }
      return d;
    }));
  };

  const mandatoryDocs = docs.filter(d => d.mandatory);
  const uploadedMandatory = mandatoryDocs.filter(d => d.status === 'uploaded').length;
  const readinessScore = mandatoryDocs.length > 0 ? Math.round((uploadedMandatory / mandatoryDocs.length) * 100) : 0;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span className="badge" style={{ background: "#dbeafe", color: "#2563eb", border: "1px solid #93c5fd" }}>Compliance</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          Application Readiness Auditor
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
          Verify your documents before applying to prevent rejection
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '600' }}>
          Select Target Scheme
        </label>
        <select 
          value={selectedScheme} 
          onChange={handleSchemeSelect}
          style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937', fontSize: '15px' }}
        >
          <option value="">-- Choose a scheme to audit --</option>
          {schemesList.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedScheme && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Required Document Checklist
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Click on a document to mark it as ready.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {docs.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => toggleDocStatus(doc.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: doc.status === 'uploaded' ? 'rgba(16, 185, 129, 0.1)' : '#f9fafb',
                    border: doc.status === 'uploaded' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ color: doc.status === 'uploaded' ? '#10b981' : '#9ca3af' }}>
                    {doc.status === 'uploaded' ? <FileCheck size={24} /> : <FileX size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: doc.status === 'uploaded' ? '#065f46' : '#374151' }}>{doc.name}</span>
                      {doc.mandatory ? (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: '700' }}>MANDATORY</span>
                      ) : (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', fontWeight: '700' }}>OPTIONAL</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{doc.desc}</div>
                  </div>
                  <div>
                    {doc.status === 'uploaded' ? (
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Ready</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>Missing</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', height: 'fit-content', position: 'sticky', top: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '20px' }}>Application Score</h2>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `8px solid ${readinessScore === 100 ? '#10b981' : readinessScore > 50 ? '#f59e0b' : '#ef4444'}`,
                color: readinessScore === 100 ? '#10b981' : readinessScore > 50 ? '#f59e0b' : '#ef4444',
                fontSize: '32px', fontWeight: '800'
              }}>
                {readinessScore}%
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: '600' }}>
                <span>Mandatory Documents</span>
                <span style={{ fontWeight: '700', color: '#1f2937' }}>{uploadedMandatory} / {mandatoryDocs.length}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${readinessScore}%`, 
                  backgroundColor: readinessScore === 100 ? '#10b981' : '#f59e0b',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>

            {readinessScore === 100 ? (
              <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ color: '#047857', fontSize: '14px', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Audit Passed!
                </div>
                <div style={{ color: '#065f46', fontSize: '12px' }}>
                  You have all mandatory documents ready. You can safely proceed to apply.
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ color: '#b91c1c', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>
                  Incomplete Application
                </div>
                <div style={{ color: '#991b1b', fontSize: '12px' }}>
                  Missing {mandatoryDocs.length - uploadedMandatory} mandatory documents. Application will be rejected if submitted now.
                </div>
              </div>
            )}

            <button 
              disabled={readinessScore < 100}
              onClick={() => window.open('https://www.myscheme.gov.in/', '_blank')}
              style={{ 
                width: '100%', padding: '14px', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                border: 'none', cursor: readinessScore === 100 ? 'pointer' : 'not-allowed',
                backgroundColor: readinessScore === 100 ? '#3b82f6' : '#9ca3af',
                color: '#fff',
                transition: 'all 0.2s',
                boxShadow: readinessScore === 100 ? '0 4px 6px rgba(59, 130, 246, 0.2)' : 'none'
              }}
            >
              Proceed to Apply <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
