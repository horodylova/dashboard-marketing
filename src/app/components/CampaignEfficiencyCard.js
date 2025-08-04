"use client";

import { useState, useEffect } from "react";
import { DatePicker, DateInput } from "@progress/kendo-react-dateinputs";
import { SvgIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { ListView } from "@progress/kendo-react-listview";
import { xIcon, arrowUpIcon, arrowDownIcon } from "@progress/kendo-svg-icons";
import { gridSvgIcons } from "../svg-icons";
import { Popup } from "@progress/kendo-react-popup";
import {
  getUniqueCampaigns,
  getActiveCampaignDates,
  calculateDailyConversion
} from "../utils/campaignUtils";

const CampaignEfficiencyItemRender = (props) => {
  const { dataItem } = props;
  
  const icon = gridSvgIcons.find(icon => icon.name === dataItem.platform?.toLowerCase())?.svg;
  
  return (
    <div
      role="listitem"
      className="k-d-flex k-gap-3 k-border-b k-border-b-solid k-border-border k-p-2 k-align-items-center"
    >
      <div className="k-d-flex k-align-items-center">
        {icon}
      </div>
      <div className="k-d-flex k-flex-col k-flex-1">
        <span className="k-font-size-md">{dataItem.name}</span>
        <span className="k-font-size-sm k-color-subtle">
          {dataItem.date}
        </span>
      </div>
      <div className="k-d-flex k-flex-col k-align-items-end k-justify-content-center">
        <span
          className={
            dataItem.change >= 0
              ? "k-font-size-md k-color-success k-font-weight-bold"
              : "k-font-size-md k-color-error k-font-weight-bold"
          }
        >
          <SvgIcon
            icon={dataItem.change >= 0 ? arrowUpIcon : arrowDownIcon}
          />
          {Math.abs(dataItem.change).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

const CampaignEfficiencyCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDates, setActiveDates] = useState([]);
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [firstAvailableDate, setFirstAvailableDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
        setCampaigns(getUniqueCampaigns(data));
        const dates = getActiveCampaignDates(data);
        
        setActiveDates(dates);
        
        if (dates.length > 0) {
          setFirstAvailableDate(dates[0]);
          setSelectedDate(new Date(dates[dates.length - 1]));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    if (!campaignData || !selectedDate) return;
    
    const dateString = selectedDate.toISOString().split('T')[0];
    
    if (!activeDates.includes(dateString)) {
      setEfficiencyData([]);
      return;
    }
    
    const efficiencyItems = campaigns.map(campaign => {
      const { conversion, change } = calculateDailyConversion(campaignData, campaign.id, dateString);
      
      return {
        id: campaign.id,
        name: campaign.name,
        date: dateString,
        conversion,
        change,
        platform: campaign.platform
      };
    });
    
    setEfficiencyData(efficiencyItems);
  }, [campaignData, campaigns, selectedDate, activeDates]);

  const handleDateChange = (e) => {
    const newDate = e.value;
    setSelectedDate(newDate);
    
    const dateString = newDate.toISOString().split('T')[0];
    if (!activeDates.includes(dateString)) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleDatePickerClick = (e) => {
    setAnchor(e.target);
  };

  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-5 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: "392px", minHeight: "392px" }}
    >
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-p-4">
        <div className="k-d-flex k-flex-col">
          <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
            Campaigns: Efficiency
          </span>
          <span className="k-font-size-xs k-color-subtle k-mt-1">
            Efficiency Formula: (Clicks / Landing Page Views) × 100%
          </span>
        </div>
        <div style={{ width: "164px" }} onClick={handleDatePickerClick}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput
                  ariaLabel="Campaign efficiency date picker"
                  value={selectedDate}
                />
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
                Data available from {firstAvailableDate}
              </div>
            </Popup>
          )}
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-flex-1 k-overflow-auto" style={{ minHeight: '250px' }}>
        {isLoading ? (
          <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center k-flex-1 k-color-subtle">
            <p>Loading campaign data...</p>
          </div>
        ) : efficiencyData.length > 0 ? (
          <ListView
            data={efficiencyData}
            item={CampaignEfficiencyItemRender}
            className="k-flex-1"
          />
        ) : (
          <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center k-flex-1 k-color-subtle">
            <p>No data available for the selected date.</p>
            <p>Please select a date between {firstAvailableDate} and {activeDates[activeDates.length - 1]}.</p>
          </div>
        )}
      </div>
      <div className="k-d-flex k-flex-row k-p-4">
        <div className="k-d-flex k-flex-row k-p-4">
          <div className="k-d-flex k-flex-col k-w-full">
           
            <Button fillMode="clear" themeColor="primary" className="k-mt-2">
              View all campaigns
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignEfficiencyCard;