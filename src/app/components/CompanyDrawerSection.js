"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import AddCompanyModal from './AddCompanyModal';

const CompanyDrawerSection = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    setIsClient(true);
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/companies.json');
      const data = await response.json();
      setCompanies(data);
      if (data.length > 0) {
        setSelectedCompany(data[0].id);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyClick = (companyId) => {
    setSelectedCompany(companyId);
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setShowModal(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowModal(true);
  };

  const handleDeleteCompany = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(company => company.id !== companyId));
      if (selectedCompany === companyId) {
        const remainingCompanies = companies.filter(company => company.id !== companyId);
        setSelectedCompany(remainingCompanies.length > 0 ? remainingCompanies[0].id : null);
      }
    }
  };

  const handleSaveCompany = (companyData) => {
    if (editingCompany) {
      setCompanies(companies.map(company => 
        company.id === editingCompany.id 
          ? { ...company, ...companyData }
          : company
      ));
    } else {
      const newCompany = {
        id: Date.now(),
        ...companyData
      };
      setCompanies([...companies, newCompany]);
    }
    setShowModal(false);
    setEditingCompany(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCompany(null);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div 
      className="company-drawer-section" 
      style={{ 
        background: 'white',
        minHeight: '100vh',
        width: '320px',
        padding: '16px 0',
        paddingTop: '50px'
      }}
    >
      <div 
        className="companies-list"
        style={{
          minHeight: isLoading ? '200px' : 'auto',
          marginBottom: '16px'
        }}
      >
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          companies.map((company) => (
            <div
              key={company.id}
              className="company-item"
              onClick={() => handleCompanyClick(company.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: selectedCompany === company.id ? 'rgba(91, 80, 226, 0.1)' : 'transparent',
                borderLeft: selectedCompany === company.id ? '3px solid var(--kendo-color-primary)' : '3px solid transparent',
                transition: 'all 0.2s ease',
                minHeight: '48px'
              }}
              onMouseEnter={(e) => {
                if (selectedCompany !== company.id) {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCompany !== company.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <span 
                  className="k-item-text" 
                  style={{ 
                    color: 'black',
                    fontSize: '14px',
                    fontWeight: selectedCompany === company.id ? '600' : '400',
                    fontFamily: 'Quicksand, sans-serif'
                  }}
                >
                  {company.name}
                </span>
              </div>
              {company.name !== 'Butterfly' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCompany(company);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCompany(company.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div style={{
        padding: '0 16px',
        borderTop: '1px solid rgba(31, 31, 31, 0.16)',
        paddingTop: '16px'
      }}>
        <Button
          onClick={handleAddCompany}
          style={{
            width: '100%',
            backgroundColor: 'var(--kendo-color-primary)',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'Quicksand, sans-serif',
            boxShadow: '0 2px 4px rgba(91, 80, 226, 0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--kendo-color-primary-hover)';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(91, 80, 226, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--kendo-color-primary)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(91, 80, 226, 0.2)';
          }}
        >
          Add Company
        </Button>
      </div>

      <AddCompanyModal
        visible={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveCompany}
        editingCompany={editingCompany}
      />
    </div>
  );
};

export default CompanyDrawerSection;