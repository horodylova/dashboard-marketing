"use client";

import { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon } from '@progress/kendo-svg-icons';
import { 
  calculateCAC, 
  calculateROMI, 
  calculateConversionRate, 

} from '../utils/campaignUtils';

const MarketingEfficiencyCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [allCampaignData, setAllCampaignData] = useState([]);

  const getDayOfWeek = (date) => {
    return date.getDay();
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/campaign-data.json');
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
      
      const campaignGroups = {};
      currentDayData.forEach(item => {
        const key = item.campaign_id;
        if (!campaignGroups[key]) {
          campaignGroups[key] = {
            campaign_name: item.campaign_name,
            platform: item.platform,
            data: []
          };
        }
        campaignGroups[key].data.push(item);
      });

      const processedData = [];
      let totalSpend = 0;
      let totalRevenue = 0;
      let totalLeads = 0;
      let totalSales = 0;

      Object.keys(campaignGroups).forEach(campaignId => {
        const group = campaignGroups[campaignId];
        const latestData = group.data.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        })[0];

        const spend = latestData.spend || 0;
        const revenue = latestData.revenue || 0;
        const leads = latestData.leads || 0;
        const sales = latestData.sales || 0;
        const cac = calculateCAC(spend, leads);
        const romi = calculateROMI(revenue, spend);
        const conversionRate = calculateConversionRate(sales, leads);

        totalSpend += spend;
        totalRevenue += revenue;
        totalLeads += leads;
        totalSales += sales;

        processedData.push({
          campaign: `${group.campaign_name}`,
          platform: group.platform,
          cac: cac,
          romi: romi,
          conversionRate: conversionRate,
          leads: leads,
          sales: sales,
          spend: spend,
          revenue: revenue
        });
      });

      processedData.sort((a, b) => b.romi - a.romi);
      setChartData(processedData);

      const overallCAC = calculateCAC(totalSpend, totalLeads);
      const overallROMI = calculateROMI(totalRevenue, totalSpend);
      const overallConversion = calculateConversionRate(totalSales, totalLeads);

      setSummaryData({
        overallCAC,
        overallROMI,
        overallConversion
      });
    }
  }, [allCampaignData, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  const handleInfoClick = (event) => {
    event.stopPropagation();
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setShowTooltip(!showTooltip);
  };

  const handleContainerClick = () => {
    if (showTooltip) {
      setShowTooltip(false);
    }
  };

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="k-d-flex k-flex-col k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl k-col-span-md-6" style={{ minHeight: '300px' }}>
        <div className="k-d-flex k-justify-content-center k-align-items-center k-flex-1">
          <div>Loading efficiency data...</div>
        </div>
      </div>
    );
  }

  return (
   <div 
     className="k-d-flex k-flex-col k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl k-col-span-md-6" 
     style={{ minHeight: '300px', minWidth: '0' }}
     onClick={handleContainerClick}
   >
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <div className="k-d-flex k-align-items-center k-gap-2">
          <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
            Marketing Efficiency
          </span>
          <SvgIcon 
            icon={infoCircleIcon} 
            size="small" 
            style={{ cursor: 'pointer', opacity: 0.7 }}
            onClick={handleInfoClick}
          />
        </div>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            fillMode="flat"
          />
        </div>
      </div>

      {summaryData && (
        <div className="k-px-2 k-px-md-3 k-pb-2">
          <div className="k-d-grid k-grid-cols-3 k-gap-2 k-font-size-sm">
            <div className="k-text-center k-p-2 k-bg-surface k-rounded">
              <div className="k-font-weight-bold k-color-primary">{formatPercentage(summaryData.overallROMI)}</div>
              <div className="k-opacity-75">Avg ROMI</div>
            </div>
            <div className="k-text-center k-p-2 k-bg-surface k-rounded">
              <div className="k-font-weight-bold k-color-secondary">{formatCurrency(summaryData.overallCAC)}</div>
              <div className="k-opacity-75">Avg CAC</div>
            </div>
            <div className="k-text-center k-p-2 k-bg-surface k-rounded">
              <div className="k-font-weight-bold k-color-success">{formatPercentage(summaryData.overallConversion)}</div>
              <div className="k-opacity-75">Conversion</div>
            </div>
          </div>
        </div>
      )}

      <div className="k-flex-1 k-px-2 k-px-md-3">
        {chartData.length > 0 ? (
          <Chart style={{ height: '250px' }}>
            <ChartCategoryAxis>
              <ChartCategoryAxisItem 
                categories={chartData.map(item => item.campaign)}
                labels={{ rotation: -45, font: '10px Arial' }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem name="percentage" title={{ text: "ROMI (%)" }} />
              <ChartValueAxisItem name="currency" title={{ text: "CAC ($)" }} position="right" />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem 
                type="line" 
                data={chartData.map(item => item.romi)}
                name="ROMI (%)"
                color="#339af0"
                axis="percentage"
                markers={{ visible: true, size: 4 }}
              />
              <ChartSeriesItem 
                type="column" 
                data={chartData.map(item => item.cac)}
                name="CAC ($)"
                color="#ffa726"
                axis="currency"
              />
            </ChartSeries>
            <ChartTooltip 
              render={(context) => {
                const seriesName = context.point.series.name;
                const value = context.point.value;
                
                if (seriesName === "CAC ($)") {
                  return `CAC ${value.toFixed(2)} $`;
                } else if (seriesName === "ROMI (%)") {
                  return `ROMI ${value.toFixed(1)} %`;
                }
                return `${seriesName} ${value}`;
              }}
            />
          </Chart>
        ) : (
          <div className="k-d-flex k-justify-content-center k-align-items-center k-flex-1">
            <div className="k-text-center k-opacity-75">
              <div>No efficiency data available</div>
              <div className="k-font-size-sm">for selected date</div>
            </div>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="k-px-2 k-px-md-3 k-pb-2 k-pt-1">
          <div className="k-font-size-sm k-font-weight-bold k-mb-1">Most Efficient:</div>
          <div className="k-d-flex k-flex-col k-gap-1">
            {chartData.slice(0, 3).map((item, index) => (
              <div key={index} className="k-d-flex k-justify-content-between k-align-items-center k-p-1 k-bg-surface k-rounded k-font-size-xs">
                <div className="k-font-weight-bold">{item.campaign}</div>
                <div className={`k-font-weight-bold ${item.romi > 0 ? 'k-color-success' : 'k-color-error'}`}>
                  {formatPercentage(item.romi)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTooltip && (
        <div 
          className="k-tooltip k-tooltip-top"
          style={{
            position: 'fixed',
            left: tooltipPosition.x - 150,
            top: tooltipPosition.y - 100,
            zIndex: 10000,
            maxWidth: '320px',
            padding: '12px',
            backgroundColor: 'var(--kendo-color-surface-alt)',
            border: '1px solid var(--kendo-color-border)',
            borderRadius: '4px',
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            color: '#000'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ marginTop: '8px', color: '#000' }}>
            <div style={{ marginBottom: '4px' }}><strong>ROMI:</strong> Return on Marketing Investment - measures revenue generated per dollar spent</div>
            <div style={{ marginBottom: '4px' }}><strong>CAC:</strong> Customer Acquisition Cost - average cost to acquire one customer</div>
            <div style={{ marginBottom: '4px' }}><strong>Conversion Rate:</strong> Percentage of leads that convert to actual sales</div>
            <div style={{ marginBottom: '4px' }}><strong>Efficiency Analysis:</strong> Compare campaign performance using standardized metrics</div>
            <div style={{ marginBottom: '4px' }}><strong>Day-of-Week Filter:</strong> View efficiency data for campaigns active on selected day</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.8, fontStyle: 'italic', color: '#000' }}>
            💡 Higher ROMI and lower CAC indicate more efficient marketing campaigns
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingEfficiencyCard;