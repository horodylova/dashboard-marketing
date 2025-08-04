"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActionsBar,
} from '@progress/kendo-react-dialogs';
import {
  Form,
  Field,
  FormElement,
} from '@progress/kendo-react-form';
import {
  Input,
} from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

const AddCompanyModal = ({ visible, onClose, onSave, editingCompany }) => {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    webhookUrl: ''
  });

  useEffect(() => {
    setIsClient(true);
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

  const requiredValidator = (value) => {
    return value ? "" : "This field is required";
  };

  const urlValidator = (value) => {
    if (!value) return "This field is required";
    const urlPattern = /^https?:\/\/.+/;
    return urlPattern.test(value) ? "" : "Please enter a valid URL";
  };

  if (!isClient || !visible) {
    return null;
  }

  return (
    <Dialog
      title={editingCompany ? "Edit Company" : "Add Company"}
      onClose={handleCancel}
      visible={visible}
      width={450}
      height={300}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '20px' }}>
          <div className="k-form-field" style={{ marginBottom: '15px' }}>
            <label className="k-label">Company Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="k-form-field" style={{ marginBottom: '15px' }}>
            <label className="k-label">Webhook URL</label>
            <Input
              name="webhookUrl"
              value={formData.webhookUrl}
              onChange={handleFieldChange}
              required
            />
          </div>
        </div>
        <DialogActionsBar>
          <Button
            onClick={handleCancel}
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            disabled={!formData.name || !formData.webhookUrl}
          >
            {editingCompany ? "Save" : "Add"}
          </Button>
        </DialogActionsBar>
      </form>
    </Dialog>
  );
};

export default AddCompanyModal;