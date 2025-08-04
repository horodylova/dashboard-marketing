"use client";

import React, { useState, useEffect } from 'react';
import { DrawerItem } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Checkbox } from '@progress/kendo-react-inputs';
import AddCompanyModal from './AddCompanyModal';

const CompanyDrawerSection = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await fetch('/companies.json');
      const data = await response.json();
      setCompanies(data);
      
      const butterfly = data.find(company => company.isDefault);
      if (butterfly) {
        setSelectedCompany(butterfly.id);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      const fallbackData = [{
        id: 1,
        name: '🦋 Butterfly',
        webhookUrl: '',
        isDefault: true,
        enabled: true
      }];
      setCompanies(fallbackData);
      setSelectedCompany(1);
    }
  };

  const saveCompanies = async (newCompanies) => {
    try {
      setCompanies(newCompanies);
      console.log('Saving companies:', newCompanies);
    } catch (error) {
      console.error('Error saving companies:', error);
    }
  };

  const handleAddCompany = (newCompanyData) => {
    const newCompany = {
      id: Date.now(),
      name: newCompanyData.name,
      webhookUrl: newCompanyData.webhookUrl,
      isDefault: false,
      enabled: false
    };

    const updatedCompanies = [newCompany, ...companies];
    saveCompanies(updatedCompanies);
    setModalVisible(false);
  };

  const handleCompanySelect = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (company && company.isDefault) {
      setSelectedCompany(companyId);
    }
  };

  if (!isClient) {
    return (
      <div className="company-drawer-section">
        <div className="k-px-4 k-py-2">
          <Button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            style={{ width: '100%' }}
            disabled
          >
            ➕ Add Company
          </Button>
        </div>
        <div className="companies-list">
          <DrawerItem className="company-item selected">
            <div className="k-d-flex k-align-items-center k-w-full k-px-2">
              <Checkbox checked={true} disabled className="k-mr-2" />
              <span className="k-item-text k-flex-1">🦋 Butterfly</span>
            </div>
          </DrawerItem>
        </div>
      </div>
    );
  }

  return (
    <div className="company-drawer-section">
      <div className="k-px-4 k-py-2">
        <Button
          onClick={() => setModalVisible(true)}
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
          style={{ width: '100%' }}
        >
          ➕ Add Company
        </Button>
      </div>

      <div className="companies-list">
        {companies.map((company) => (
          <DrawerItem
            key={company.id}
            className={`company-item ${selectedCompany === company.id ? 'selected' : ''}`}
          >
            <div className="k-d-flex k-align-items-center k-w-full k-px-2">
              <Checkbox
                checked={selectedCompany === company.id}
                disabled={!company.isDefault}
                onChange={() => handleCompanySelect(company.id)}
                className="k-mr-2"
              />
              <span className="k-item-text k-flex-1">{company.name}</span>
            </div>
          </DrawerItem>
        ))}
      </div>

      {isClient && (
        <AddCompanyModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAddCompany}
        />
      )}
    </div>
  );
};

export default CompanyDrawerSection;