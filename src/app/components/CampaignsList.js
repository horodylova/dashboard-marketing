"use client";

import { useState, useEffect } from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon, pencilIcon, trashIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { ListView } from '@progress/kendo-react-listview';
import { Checkbox } from '@progress/kendo-react-inputs';
import { Popup } from "@progress/kendo-react-popup";


const CampaignsListItemRender = (props) => {
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
        <span className="k-color-primary">{props.dataItem.ai_score}</span>
      </div>
    </div>
  );
};

const CampaignsList = () => {
  const [campaignItems, setCampaignItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [aiData, setAiData] = useState({ score: 0, overview: '' });
  const [availableDates, setAvailableDates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
         
        const uniqueCampaigns = {};
        data.data.forEach(item => {
          uniqueCampaigns[item.campaign_id] = {
            name: item.campaign_name,
            platform: item.platform,
            ai_score: item.ai_score,
            ai_comment: item.ai_comment,
            date: item.date
          };
        });
        
        const campaignList = Object.entries(uniqueCampaigns).map(([id, campaign]) => ({
          id,
          text: campaign.name,
          checked: false,
          platform: campaign.platform,
          ai_score: campaign.ai_score,
          ai_comment: campaign.ai_comment,
          date: campaign.date
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
        
        if (dates.length > 0) {
          setSelectedDate(new Date(dates[dates.length - 1]));
        }
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      const campaign = campaignItems.find(item => item.id === selectedCampaign);
      if (campaign) {
        setAiData({
          score: campaign.ai_score || 0,
          overview: campaign.ai_comment || 'No AI evaluation available for this campaign.'
        });
      }
    }
  }, [selectedCampaign, campaignItems]);

  const handleDateChange = (e) => {
    setSelectedDate(e.value);
    setSelectedCampaign(null);
    setAiData({ score: 0, overview: '' });
    
    setCampaignItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        checked: false
      }))
    );
    
    const dateString = e.value.toISOString().split('T')[0];
    if (!availableDates.includes(dateString)) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setCampaignItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        checked: item.id === id ? true : false
      }))
    );
    setSelectedCampaign(id);
 
    const campaign = campaignItems.find(item => item.id === id);
    if (campaign) {
      setAiData({
        score: campaign.ai_score || 0,
        overview: campaign.ai_comment || 'No AI evaluation available for this campaign.'
      });
    }
  };

  const handleDatePickerClick = (e) => {
    setAnchor(e.target);
  };

  const dateString = selectedDate.toISOString().split('T')[0];
  const filteredCampaigns = campaignItems.filter(item => item.date === dateString);
 
  const selectedCampaignInFilteredList = selectedCampaign && 
    filteredCampaigns.some(item => item.id === selectedCampaign);

  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: '392px' }}
    >
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          AI Evaluation
        </span>
        <div style={{ width: '142px' }} onClick={handleDatePickerClick}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Campaigns List date picker" value={selectedDate} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
          {showPopup && anchor && (
            <Popup
              anchor={anchor}
              show={showPopup}
              popupClass="k-popup-content"
              animate={false}
              position="bottom"
            >
              <div className="k-p-3 k-bg-error-lighter k-color-error k-rounded-md">
                Data available from {availableDates[0]} to {availableDates[availableDates.length - 1]}
              </div>
            </Popup>
          )}
        </div>
      </div>
      <div className="k-d-flex k-flex-col k-px-4 k-flex-1 k-overflow-hidden">
        <div className="k-d-flex k-justify-content-between k-mb-2">
          <span className="k-font-size-sm k-color-subtle">Campaign</span>
          <span className="k-font-size-sm k-color-subtle">AI Score</span>
        </div>
        <div className="k-overflow-y-auto" style={{ maxHeight: '180px' }}>
          {availableDates.includes(dateString) ? (
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