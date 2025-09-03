"use client";

import { useState, useEffect } from 'react';
import { ListView } from '@progress/kendo-react-listview';
import { Checkbox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';

const CampaignsListItemRender = (props) => {
  const handleCheckboxChange = () => {
    if (props.onCheckboxChange) {
      props.onCheckboxChange(props.dataItem);
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
        <span className="k-color-primary">{props.dataItem.ai_score}</span>
      </div>
    </div>
  );
};

const CampaignsList = ({ selectedCampaign, onCampaignSelect, selectedDate, onDateChange }) => {
  const [campaignItems, setCampaignItems] = useState([]);
  const [localSelectedCampaign, setLocalSelectedCampaign] = useState(null);
  const [aiData, setAiData] = useState({ score: 0, overview: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [allCampaignData, setAllCampaignData] = useState([]);

  const getDayOfWeek = (date) => {
    return date.getDay();
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setAllCampaignData(data);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    if (allCampaignData.length > 0) {
      const currentDay = getDayOfWeek(selectedDate || new Date());
      
      const currentDayData = allCampaignData.filter(item => {
        const itemDate = new Date(item.date);
        return getDayOfWeek(itemDate) === currentDay;
      });
      
      const uniqueCampaigns = currentDayData.reduce((acc, item) => {
        if (!acc.find(campaign => campaign.id === item.campaign_id)) {
          acc.push({
            id: item.campaign_id,
            text: item.campaign_name,
            checked: false,
            platform: item.platform,
            ai_score: item.ai_score,
            ai_comment: item.ai_comment,
            date: item.date
          });
        }
        return acc;
      }, []);
      
      if (uniqueCampaigns.length > 0) {
        uniqueCampaigns[0].checked = true;
        setCampaignItems(uniqueCampaigns);
        setLocalSelectedCampaign(uniqueCampaigns[0]);
        setAiData({
          score: uniqueCampaigns[0].ai_score || 0,
          overview: uniqueCampaigns[0].ai_comment || 'No AI insights available for this campaign.'
        });
        
        if (onCampaignSelect) {
          onCampaignSelect(uniqueCampaigns[0]);
        }
      } else {
        setCampaignItems([]);
        setLocalSelectedCampaign(null);
        setAiData({ score: 0, overview: '' });
      }
    }
  }, [selectedDate, allCampaignData]);

  const handleCheckboxChange = (campaignData) => {
    const updatedCampaigns = campaignItems.map(campaign => ({
      ...campaign,
      checked: campaign.id === campaignData.id
    }));
    
    setCampaignItems(updatedCampaigns);
    setLocalSelectedCampaign(campaignData);
    
    setAiData({
      score: campaignData.ai_score || 0,
      overview: campaignData.ai_comment || 'No AI insights available for this campaign.'
    });
    
    if (onCampaignSelect) {
      onCampaignSelect(campaignData);
    }
  };

  const handleDateChange = (event) => {
    if (onDateChange) {
      onDateChange(event.value);
    }
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Campaigns List
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={selectedDate || new Date()}
            onChange={handleDateChange}
            fillMode="flat"
          />
        </div>
      </div>
      <div className="k-d-flex k-flex-col k-px-4 k-flex-1 k-overflow-hidden">
        <div className="k-d-flex k-justify-content-between k-mb-2">
          <span className="k-font-size-sm k-color-subtle">Campaign</span>
          <span className="k-font-size-sm k-color-subtle">AI Score</span>
        </div>
        <div className="k-overflow-y-auto" style={{ maxHeight: '180px' }}>
          {isLoading ? (
            <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center k-flex-1 k-color-subtle k-p-4">
              <p>Loading campaigns...</p>
            </div>
          ) : (
            campaignItems.length > 0 ? (
              <ListView
                className="k-w-full k-height-auto k-overflow-y-auto k-gap-1"
                data={campaignItems}
                item={(props) => <CampaignsListItemRender {...props} onCheckboxChange={handleCheckboxChange} />}
              />
            ) : (
              <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center k-flex-1 k-color-subtle k-p-4">
                <p>No campaigns found.</p>
              </div>
            )
          )}
        </div>
        
        {localSelectedCampaign && (
          <div className="k-mt-4 k-p-3 k-border k-border-solid k-border-border k-rounded-md">
            <div>
              <span className="k-font-size-md k-color-subtle">AI Overview</span>
              <p className="k-mt-1 k-font-size-md k-color-text">{aiData.overview}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsList;