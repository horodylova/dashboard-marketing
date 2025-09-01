"use client";

import { useState, useEffect } from "react";
import { ListView } from "@progress/kendo-react-listview";
import { SvgIcon } from "@progress/kendo-react-common";
import { arrowUpIcon, arrowDownIcon } from "@progress/kendo-svg-icons";
import { gridSvgIcons } from "../svg-icons";
import {
  getCampaignEfficiencyByDayOfWeek
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
      </div>
      <div className="k-d-flex k-flex-col k-align-items-end k-justify-content-center">
        <span className="k-font-size-md k-color-primary k-font-weight-bold">
          {dataItem.efficiency}%
        </span>
      </div>
      <div className="k-d-flex k-flex-col k-align-items-end k-justify-content-center">
        <span className={dataItem.efficiency >= 100 ? "k-font-size-md k-color-success" : "k-font-size-md k-color-error"}>
          <SvgIcon
            icon={dataItem.efficiency >= 100 ? arrowUpIcon : arrowDownIcon}
          />
        </span>
      </div>
    </div>
  );
};

const CampaignEfficiencyCard = () => {
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/campaign-data.json');
        const rawData = await response.json();
        
        const efficiencyItems = getCampaignEfficiencyByDayOfWeek(rawData, null);
        setEfficiencyData(efficiencyItems);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

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
            <p>No campaign data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignEfficiencyCard;
