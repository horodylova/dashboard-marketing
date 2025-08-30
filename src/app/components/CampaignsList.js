"use client";

import { useState, useEffect } from 'react';
import { ListView } from '@progress/kendo-react-listview';
import { Checkbox } from '@progress/kendo-react-inputs';

const CampaignsListItemRender = (props) => {
  const handleCheckboxChange = () => {
    if (props.onCheckboxChange) {
      props.onCheckboxChange(props.dataItem.id, props.dataItem.text);
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

const CampaignsList = ({ selectedCampaign, onCampaignSelect }) => {
  const [campaignItems, setCampaignItems] = useState([]);
  const [localSelectedCampaign, setLocalSelectedCampaign] = useState(null);
  const [aiData, setAiData] = useState({ score: 0, overview: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
         
        const campaignList = data.data.map(item => ({
          id: item.campaign_id,
          text: item.campaign_name,
          checked: false,
          platform: item.platform,
          ai_score: item.ai_score,
          ai_comment: item.ai_comment,
          date: item.date
        }));
        
        setCampaignItems(campaignList);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    const uniqueCampaigns = campaignItems.reduce((acc, item) => {
      if (!acc[item.id]) {
        const latestRecord = campaignItems
          .filter(campaign => campaign.id === item.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        acc[item.id] = {
          id: item.id,
          text: item.text,
          checked: false,
          platform: item.platform,
          ai_score: latestRecord.ai_score,
          ai_comment: latestRecord.ai_comment
        };
      }
      return acc;
    }, {});
    
    const filtered = Object.values(uniqueCampaigns);
    setFilteredCampaigns(filtered);
  }, [campaignItems]);

  useEffect(() => {
    if (selectedCampaign) {
      setLocalSelectedCampaign(selectedCampaign);
    }
  }, [selectedCampaign]);

  useEffect(() => {
    if (!hasAutoSelected && filteredCampaigns.length > 0 && !localSelectedCampaign) {
      const firstCampaign = filteredCampaigns[0];
      setLocalSelectedCampaign(firstCampaign);
      if (onCampaignSelect) {
        onCampaignSelect(firstCampaign);
      }
      setHasAutoSelected(true);
    }
  }, [filteredCampaigns, localSelectedCampaign, hasAutoSelected, onCampaignSelect]);

  useEffect(() => {
    if (localSelectedCampaign) {
      const campaignData = campaignItems.find(item => item.id === localSelectedCampaign.id);
      if (campaignData) {
        setAiData({
          score: campaignData.ai_score || 0,
          overview: campaignData.ai_comment || 'No AI insights available for this campaign.'
        });
      }
    }
  }, [localSelectedCampaign, campaignItems]);

  const handleCheckboxChange = (campaignId, campaignName) => {
    const updatedCampaigns = filteredCampaigns.map(campaign => ({
      ...campaign,
      checked: campaign.id === campaignId ? !campaign.checked : false
    }));
    setFilteredCampaigns(updatedCampaigns);

    const selectedCampaignData = updatedCampaigns.find(campaign => campaign.checked);
    setLocalSelectedCampaign(selectedCampaignData || null);
    
    if (onCampaignSelect) {
      onCampaignSelect(selectedCampaignData || null);
    }
  };

  const selectedCampaignInFilteredList = filteredCampaigns.some(
    campaign => localSelectedCampaign && campaign.id === localSelectedCampaign.id
  );

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Campaigns List
        </span>
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
            filteredCampaigns.length > 0 ? (
              <ListView
                className="k-w-full k-height-auto k-overflow-y-auto k-gap-1"
                data={filteredCampaigns}
                item={(props) => <CampaignsListItemRender {...props} onCheckboxChange={handleCheckboxChange} />}
              />
            ) : (
              <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center k-flex-1 k-color-subtle k-p-4">
                <p>No campaigns found.</p>
              </div>
            )
          )}
        </div>
        
        {selectedCampaignInFilteredList && (
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