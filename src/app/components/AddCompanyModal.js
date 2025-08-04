"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActionsBar,
} from '@progress/kendo-react-dialogs';

import {
  Input,
} from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

const AddCompanyModal = ({ visible, onClose, onSave, editingCompany }) => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    webhookUrl: ''
  });

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (visible) {
      if (editingCompany) {
        setFormData({
          name: editingCompany.name || '',
          webhookUrl: editingCompany.webhookUrl || ''
        });
      } else {
        setFormData({ name: '', webhookUrl: '' });
      }
    }
  }, [editingCompany, visible]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.name && formData.webhookUrl) {
      onSave({
        name: formData.name,
        webhookUrl: formData.webhookUrl
      });
      setFormData({ name: '', webhookUrl: '' });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', webhookUrl: '' });
    onClose();
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  if (!isClient || !visible) {
    return null;
  }

  return (
    <Dialog
      title={editingCompany ? "Edit Company" : "Add Company"}
      onClose={handleCancel}
      visible={visible}
      width={isMobile ? '90vw' : 450}
      height={isMobile ? 'auto' : 300}
      style={{
        maxWidth: isMobile ? '90vw' : '450px',
        margin: isMobile ? '20px auto' : 'auto'
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ padding: isMobile ? '16px' : '20px' }}>
          <div className="k-form-field" style={{ marginBottom: '15px' }}>
            <label className="k-label" style={{ fontSize: isMobile ? '16px' : '14px' }}>Company Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              required
              style={{
                fontSize: isMobile ? '16px' : '14px',
                padding: isMobile ? '12px' : '8px'
              }}
            />
          </div>
          <div className="k-form-field" style={{ marginBottom: '15px' }}>
            <label className="k-label" style={{ fontSize: isMobile ? '16px' : '14px' }}>Webhook URL</label>
            <Input
              name="webhookUrl"
              value={formData.webhookUrl}
              onChange={handleFieldChange}
              required
              style={{
                fontSize: isMobile ? '16px' : '14px',
                padding: isMobile ? '12px' : '8px'
              }}
            />
          </div>
        </div>
        <DialogActionsBar style={{
          padding: isMobile ? '16px' : '12px',
          gap: isMobile ? '12px' : '8px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Button
            onClick={handleCancel}
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            style={{
              width: isMobile ? '100%' : 'auto',
              padding: isMobile ? '12px 16px' : '8px 16px',
              fontSize: isMobile ? '16px' : '14px'
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            disabled={!formData.name || !formData.webhookUrl}
            style={{
              width: isMobile ? '100%' : 'auto',
              padding: isMobile ? '12px 16px' : '8px 16px',
              fontSize: isMobile ? '16px' : '14px'
            }}
          >
            {editingCompany ? "Save" : "Add"}
          </Button>
        </DialogActionsBar>
      </form>
    </Dialog>
  );
};

export default AddCompanyModal;