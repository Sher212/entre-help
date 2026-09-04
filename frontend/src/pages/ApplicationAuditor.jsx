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
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <h1 className="page-title"><ClipboardCheck size={24} style={{ marginRight: '8px' }} /> Application Readiness Auditor</h1>
        <p className="page-subtitle">Verify your documents before applying to prevent rejection</p>
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
          Select Target Scheme
        </label>
        <select 
          value={selectedScheme} 
          onChange={handleSchemeSelect}
          style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', fontSize: '15px' }}
        >
          <option value="">-- Choose a scheme to audit --</option>
          {schemesList.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedScheme && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Required Document Checklist
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Click on a document to mark it as ready.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {docs.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => toggleDocStatus(doc.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: doc.status === 'uploaded' ? 'rgba(16, 185, 129, 0.1)' : '#0f172a',
                    border: doc.status === 'uploaded' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #334155'
                  }}
                >
                  <div style={{ color: doc.status === 'uploaded' ? '#10b981' : '#64748b' }}>
                    {doc.status === 'uploaded' ? <FileCheck size={24} /> : <FileX size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: doc.status === 'uploaded' ? '#f8fafc' : '#cbd5e1' }}>{doc.name}</span>
                      {doc.mandatory ? (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: '600' }}>MANDATORY</span>
                      ) : (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', fontWeight: '600' }}>OPTIONAL</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.desc}</div>
                  </div>
                  <div>
                    {doc.status === 'uploaded' ? (
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Ready</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Missing</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', height: 'fit-content', position: 'sticky', top: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc', marginBottom: '20px' }}>Application Score</h2>
            
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                <span>Mandatory Documents</span>
                <span style={{ fontWeight: '600', color: '#f8fafc' }}>{uploadedMandatory} / {mandatoryDocs.length}</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
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
                <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Audit Passed!
                </div>
                <div style={{ color: '#a7f3d0', fontSize: '12px' }}>
                  You have all mandatory documents ready. You can safely proceed to apply.
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  Incomplete Application
                </div>
                <div style={{ color: '#fecaca', fontSize: '12px' }}>
                  Missing {mandatoryDocs.length - uploadedMandatory} mandatory documents. Application will be rejected if submitted now.
                </div>
              </div>
            )}

            <button 
              disabled={readinessScore < 100}
              style={{ 
                width: '100%', padding: '14px', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                border: 'none', cursor: readinessScore === 100 ? 'pointer' : 'not-allowed',
                backgroundColor: readinessScore === 100 ? '#3b82f6' : '#334155',
                color: readinessScore === 100 ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
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
