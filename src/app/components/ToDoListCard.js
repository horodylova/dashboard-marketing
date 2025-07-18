"use client";

import { useState, useEffect } from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon, pencilIcon, trashIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { ListView } from '@progress/kendo-react-listview';
import { Checkbox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { listViewData } from '../data';

const ToDoListItemRender = (props) => {
  const handleCheckboxChange = () => {
    if (props.onCheckboxChange) {
      props.onCheckboxChange(props.dataItem.id);
    }
  };

  return (
    <div role="listitem" className="k-d-flex k-justify-content-between k-px-2 k-py-1">
      <div className="k-d-flex k-align-items-center">
        <label className="k-checkbox-label">
          <Checkbox checked={props.dataItem.checked} onChange={handleCheckboxChange} />
          {props.dataItem.text}
        </label>
      </div>
      <div className="k-white-space-nowrap">
        <Button title="Edit To Do" svgIcon={pencilIcon} fillMode="flat" size="small" />
        <Button
          title="Delete To Do"
          svgIcon={trashIcon}
          fillMode="flat"
          size="small"
          themeColor="error"
        />
      </div>
    </div>
  );
};

const ToDoListCard = () => {
  const [campaignItems, setCampaignItems] = useState([]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
         
        const uniqueCampaigns = {};
        data.data.forEach(item => {
          uniqueCampaigns[item.campaign_id] = item.campaign_name;
        });
        
      
        const campaignList = Object.entries(uniqueCampaigns).map(([id, name]) => ({
          id,
          text: name,
          checked: false
        }));
        
      
        setCampaignItems(campaignList.slice(0, 4));
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    fetchCampaignData();
  }, []);

  const handleCheckboxChange = (id) => {
    setCampaignItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: '392px' }}
    >
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Campaigns List
        </span>
        <div style={{ width: '142px' }}>
          <DatePicker
            value={new Date()}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Campaigns List date picker" value={new Date()} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-pb-4 k-flex-1 k-overflow-y-auto">
        <ListView
          className="k-w-full k-height-auto k-overflow-y-auto k-gap-1"
          data={campaignItems}
          item={(props) => <ToDoListItemRender {...props} onCheckboxChange={handleCheckboxChange} />}
        />
      </div>
    </div>
  );
};

export default ToDoListCard;