"use client";

import { useState, useEffect } from "react";
import { DatePicker, DateInput, Calendar } from "@progress/kendo-react-dateinputs";
import { SvgIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { ListView } from "@progress/kendo-react-listview";
import { xIcon, arrowUpIcon, arrowDownIcon } from "@progress/kendo-svg-icons";
import { listViewSvgIcons } from "../svg-icons";
import {
  getUniqueCampaigns,
  getActiveCampaignDates,
  calculateDailyConversion
} from "../utils/campaignUtils";

const CampaignEfficiencyItemRender = (props) => {
  const { dataItem } = props;
  
  return (
    <div
      role="listitem"
      className="k-d-flex k-gap-3 k-border-b k-border-b-solid k-border-border k-p-2"
    >
      <div>
        {props.index !== undefined && listViewSvgIcons[props.index % listViewSvgIcons.length].svg}
      </div>
      <div className="k-d-flex k-flex-col k-flex-1">
        <span className="k-font-size-md">{dataItem.name}</span>
        <span className="k-font-size-sm k-color-subtle">
          {dataItem.date}
        </span>
      </div>
      <div className="k-d-flex k-flex-col k-align-items-end">
        <span
          className={
            dataItem.change >= 0
              ? "k-font-size-sm k-color-success k-font-weight-bold"
              : "k-font-size-sm k-color-error k-font-weight-bold"
          }
        >
          <SvgIcon
            icon={dataItem.change >= 0 ? arrowUpIcon : arrowDownIcon}
          />
          {Math.abs(dataItem.change).toFixed(2)}%
        </span>
        <span className="k-font-size-sm k-color-subtle">{dataItem.conversion.toFixed(2)}%</span>
      </div>
    </div>
  );
};

// Функция для определения, является ли дата активной
const isDateActive = (date, activeDates) => {
  if (!date || !activeDates || !Array.isArray(activeDates) || activeDates.length === 0) return true;
  
  // Преобразуем дату в формат YYYY-MM-DD для сравнения
  const dateString = date.toISOString().split('T')[0];
  
  // Добавим отладочный вывод
  console.log('Checking date:', dateString, 'Active dates:', activeDates);
  
  return activeDates.includes(dateString);
};

// Кастомный компонент ячейки календаря для отключения неактивных дат
const CustomCalendarCell = (props) => {
  const { activeDates } = props;
  const isActive = isDateActive(props.date, activeDates);
  
  return (
    <td
      {...props.tdProps}
      role="gridcell"
      aria-selected={props.isSelected}
      onClick={isActive ? props.onClick : undefined}
      onKeyDown={isActive ? props.onKeyDown : undefined}
      title={props.title}
      aria-disabled={!props.isEnabled || !isActive}
      className={`${props.className} ${!isActive ? 'k-disabled' : ''}`}
    >
      <span
        className={props.linkClassName}
        style={{
          color: !isActive ? "#ccc" : undefined,
          pointerEvents: !isActive ? "none" : undefined
        }}
      >
        {props.formattedDate}
      </span>
    </td>
  );
};

const CampaignEfficiencyCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDates, setActiveDates] = useState([]);
  const [efficiencyData, setEfficiencyData] = useState([]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
        setCampaigns(getUniqueCampaigns(data));
        const dates = getActiveCampaignDates(data);
        
        // Добавим отладочный вывод
        console.log('Active dates:', dates);
        
        setActiveDates(dates);
        
        // Устанавливаем начальную дату на последнюю активную дату
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
    if (!campaignData || !selectedDate) return;
    
    const dateString = selectedDate.toISOString().split('T')[0];
    
    // Получаем данные о конверсии для каждой кампании на выбранную дату
    const efficiencyItems = campaigns.map(campaign => {
      const { conversion, change } = calculateDailyConversion(campaignData, campaign.id, dateString);
      
      return {
        id: campaign.id,
        name: campaign.name,
        date: dateString,
        conversion,
        change
      };
    });
    
    setEfficiencyData(efficiencyItems);
  }, [campaignData, campaigns, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.value);
  };

  // Создаем кастомный календарь с отключенными неактивными датами
  const CustomCalendar = (props) => {
    return (
      <Calendar
        {...props}
        cell={(cellProps) => (
          <CustomCalendarCell 
            {...cellProps} 
            activeDates={activeDates} 
          />
        )}
      />
    );
  };

  if (!campaignData || campaigns.length === 0) {
    return <div className="k-col-span-md-3 k-col-span-xl-5">Loading campaign data...</div>;
  }

  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-5 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: "392px" }}
    >
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Кампании: Эффективность
        </span>
        <div style={{ width: "164px" }}>
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
            calendar={props => <CustomCalendar {...props} />}
          />
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-flex-1 k-overflow-auto">
        <ListView
          data={efficiencyData}
          item={CampaignEfficiencyItemRender}
          className="k-flex-1"
        />
      </div>
      <div className="k-d-flex k-flex-row k-p-4">
        <Button fillMode="clear" themeColor="primary">
          Просмотреть все кампании
        </Button>
      </div>
    </div>
  );
};

export default CampaignEfficiencyCard;