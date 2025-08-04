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

const AddCompanyModal = ({ visible, onClose, onSave }) => {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    webhookUrl: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (dataItem) => {
    if (dataItem.name && dataItem.webhookUrl) {
      onSave({
        name: `🏢 ${dataItem.name}`,
        webhookUrl: dataItem.webhookUrl
      });
      setFormData({ name: '', webhookUrl: '' });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', webhookUrl: '' });
    onClose();
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
      title="➕ Add Company"
      onClose={handleCancel}
      visible={visible}
      width={450}
      height={300}
    >
      <Form
        onSubmit={handleSubmit}
        initialValues={formData}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <fieldset className="k-form-fieldset">
              <div className="k-form-field">
                <Field
                  name="name"
                  component={Input}
                  label="Company Name"
                  validator={requiredValidator}
                  placeholder="Enter company name"
                />
              </div>
              <div className="k-form-field">
                <Field
                  name="webhookUrl"
                  component={Input}
                  label="Webhook URL (Make.com)"
                  validator={urlValidator}
                  placeholder="https://hook.eu1.make.com/..."
                />
              </div>
            </fieldset>
            <DialogActionsBar>
              <Button
                type="button"
                onClick={handleCancel}
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                disabled={!formRenderProps.allowSubmit}
              >
                Add
              </Button>
            </DialogActionsBar>
          </FormElement>
        )}
      />
    </Dialog>
  );
};

export default AddCompanyModal;