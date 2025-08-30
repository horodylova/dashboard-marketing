"use client";

import { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [localSelectedCampaign, setLocalSelectedCampaign] = useState(null);
  const [aiData, setAiData] = useState({ score: 0, overview: '' });
  const [availableDates, setAvailableDates] = useState([]);
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
        
        const uniqueDates = new Set();
        data.data.forEach(item => {
          if (item.date) {
            uniqueDates.add(item.date);
          }
        });
        const dates = Array.from(uniqueDates).sort();
        setAvailableDates(dates);
        
        if (dates.includes('2025-08-13')) {
          setSelectedDate(new Date('2025-08-13'));
        } else if (dates.length > 0) {
          setSelectedDate(new Date(dates[dates.length - 1]));
        }
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    const campaignsForSelectedDate = campaignItems
      .filter(item => item.date === dateString)
      .reduce((acc, item) => {
        if (!acc[item.id]) {
          acc[item.id] = [];
        }
        acc[item.id].push(item);
        return acc;
      }, {});
    
    const filtered = Object.entries(campaignsForSelectedDate).map(([campaignId, campaignData]) => {
      const latestData = campaignData.sort((a, b) => {
        const timeA = new Date(`${a.date} ${a.time || '00:00:00'}`);
        const timeB = new Date(`${b.date} ${b.time || '00:00:00'}`);
        return timeB - timeA;
      })[0];
      
      return {
        id: campaignId,
        text: latestData.text,
        checked: localSelectedCampaign === campaignId,
        platform: latestData.platform,
        ai_score: latestData.ai_score,
        ai_comment: latestData.ai_comment,
        date: latestData.date
      };
    });
    
    setFilteredCampaigns(filtered);
  }, [selectedDate, campaignItems, localSelectedCampaign]);

  useEffect(() => {
    if (!hasAutoSelected && filteredCampaigns.length > 0 && !localSelectedCampaign) {
      const firstCampaign = filteredCampaigns[0];
      setLocalSelectedCampaign(firstCampaign.id);
      setHasAutoSelected(true);
      
      setCampaignItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          checked: item.id === firstCampaign.id
        }))
      );
      
      if (onCampaignSelect) {
        onCampaignSelect(firstCampaign.id, firstCampaign.text);
      }
    }
  }, [filteredCampaigns, localSelectedCampaign, hasAutoSelected, onCampaignSelect]);

  useEffect(() => {
    if (localSelectedCampaign) {
      const campaign = filteredCampaigns.find(item => item.id === localSelectedCampaign);
      if (campaign) {
        setAiData({
          score: campaign.ai_score || 0,
          overview: campaign.ai_comment || 'No AI evaluation available for this campaign.'
        });
      }
    }
  }, [localSelectedCampaign, filteredCampaigns]);

  const handleDateChange = (e) => {
    setSelectedDate(e.value);
    setLocalSelectedCampaign(null);
    setAiData({ score: 0, overview: '' });
    setHasAutoSelected(false);
    
    setCampaignItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        checked: false
      }))
    );
  };

  const handleCheckboxChange = (id, name) => {
    setCampaignItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        checked: item.id === id ? true : false
      }))
    );
    setLocalSelectedCampaign(id);
    
    if (onCampaignSelect) {
      onCampaignSelect(id, name);
    }
  };

  const dateString = selectedDate.toISOString().split('T')[0];
  
  const selectedCampaignInFilteredList = localSelectedCampaign && 
    filteredCampaigns.some(item => item.id === localSelectedCampaign);

  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: '392px', minHeight: '392px' }}
    >
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          AI Evaluation
        </span>
        <div style={{ width: '142px' }} >
          <DatePicker
            value={selectedDate}
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
          ) : availableDates.includes(dateString) ? (
            filteredCampaigns.length > 0 ? (
              <ListView
                className="k-w-full k-height-auto k-overflow-y-auto k-gap-1"
                data={filteredCampaigns}
                item={(props) => <CampaignsListItemRender {...props} onCheckboxChange={handleCheckboxChange} />}
              />
            ) : (
              <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center k-flex-1 k-color-subtle k-p-4">
                <p>No campaigns found for the selected date.</p>
              </div>
            )
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
          ) : (
            <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center k-flex-1 k-color-subtle k-p-4">
              <p>No data available for the selected date.</p>
              {availableDates.length > 0 && (
                <p>Data available from {availableDates[0]} to {availableDates[availableDates.length - 1]}.</p>
              )}
            </div>
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