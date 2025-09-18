"use client";

import { useState, useEffect } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon } from '@progress/kendo-svg-icons';
import { 
  calculateCAC, 
  calculateROMI, 
  calculateConversionRate, 
  calculateTotalSales, 
  calculateTotalRevenue, 
  calculateTotalLeads, 
  getLatestSpend 
} from '../utils/campaignUtils';

const FinancialPerformanceCard = () => {
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [allCampaignData, setAllCampaignData] = useState({ data: [] });

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/campaign-data.json');
        const data = await response.json();
        setAllCampaignData({ data });
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    if (allCampaignData.data && allCampaignData.data.length > 0) {
      const campaignGroups = {};
      allCampaignData.data.forEach(item => {
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
      let totalProfit = 0;
      let totalLeads = 0;
      let totalSales = 0;

      Object.keys(campaignGroups).forEach(campaignId => {
        const group = campaignGroups[campaignId];
        
        const calculatedRevenue = calculateTotalRevenue(allCampaignData, campaignId);
        const calculatedSales = calculateTotalSales(allCampaignData, campaignId);
        const calculatedLeads = calculateTotalLeads(allCampaignData, campaignId);
        const latestSpend = getLatestSpend(allCampaignData, campaignId);
        
        const cac = calculateCAC(latestSpend, calculatedLeads);
        const romi = calculateROMI(calculatedRevenue, latestSpend);
        const conversionRate = calculateConversionRate(calculatedSales, calculatedLeads);
        
        const profit = calculatedRevenue - latestSpend;

        totalSpend += latestSpend;
        totalRevenue += calculatedRevenue;
        totalProfit += profit;
        totalLeads += calculatedLeads;
        totalSales += calculatedSales;

        processedData.push({
          campaign: `${group.campaign_name}`,
          platform: group.platform,
          spend: latestSpend,
          revenue: calculatedRevenue,
          profit: profit,
          cac: cac,
          romi: romi,
          conversionRate: conversionRate,
          leads: calculatedLeads,
          sales: calculatedSales
        });
      });

      processedData.sort((a, b) => b.profit - a.profit);
      setChartData(processedData);

      setSummaryData({
        totalSpend,
        totalRevenue,
        totalProfit,
        totalLeads,
        totalSales,
        overallCAC: calculateCAC(totalSpend, totalLeads),
        overallROMI: calculateROMI(totalRevenue, totalSpend),
        overallConversion: calculateConversionRate(totalSales, totalLeads)
      });
    }
  }, [allCampaignData]);

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
          <div>Loading financial data...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="k-d-flex k-flex-col k-col-span-md-6 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl" 
      style={{ minHeight: '300px' }}
      onClick={handleContainerClick}
    >
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <div className="k-d-flex k-align-items-center k-gap-2">
          <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
            Financial Performance
          </span>
          <SvgIcon 
            icon={infoCircleIcon} 
            size="small" 
            style={{ cursor: 'pointer', opacity: 0.7 }}
            onClick={handleInfoClick}
          />
        </div>
      </div>

      {summaryData && (
        <div className="k-px-2 k-px-md-3 k-pb-2">
          <div className="k-d-grid k-grid-cols-4 k-gap-2 k-font-size-sm">
            <div className="k-text-center k-p-2 k-bg-surface k-rounded">
              <div className="k-font-weight-bold k-color-primary">{formatCurrency(summaryData.totalRevenue)}</div>
              <div className="k-opacity-75">Total Revenue</div>
            </div>
            <div className="k-text-center k-p-2 k-bg-surface k-rounded">
              <div className="k-font-weight-bold k-color-secondary">{formatCurrency(summaryData.totalSpend)}</div>
              <div className="k-opacity-75">Total Spend</div>
            </div>
            <div className="k-text-center k-p-2 k-bg-surface k-rounded">
              <div className={`k-font-weight-bold ${summaryData.totalProfit >= 0 ? 'k-color-success' : 'k-color-error'}`}>
                {formatCurrency(summaryData.totalProfit)}
              </div>
              <div className="k-opacity-75">Net Profit</div>
            </div>
            <div className="k-text-center k-p-2 k-bg-surface k-rounded">
              <div className="k-font-weight-bold k-color-info">{formatPercentage(summaryData.overallROMI)}</div>
              <div className="k-opacity-75">ROMI</div>
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
              <ChartValueAxisItem name="currency" title={{ text: "Revenue/Profit ($)" }} />
              <ChartValueAxisItem name="spend" title={{ text: "Spend ($)" }} position="right" />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem 
                type="line" 
                data={chartData.map(item => item.spend)}
                name="Spend"
                color="#dc3545"
                axis="spend"
                markers={{ visible: true, size: 6 }}
                width={3}
              />
              <ChartSeriesItem 
                type="column" 
                data={chartData.map(item => item.revenue)}
                name="Revenue"
                color="#28a745"
                axis="currency"
              />
              <ChartSeriesItem 
                type="column" 
                data={chartData.map(item => item.profit)}
                name="Profit"
                color="#007bff"
                axis="currency"
              />
            </ChartSeries>
            <ChartTooltip format="{0} ${1}" />
          </Chart>
        ) : (
          <div className="k-d-flex k-justify-content-center k-align-items-center k-flex-1">
            <div className="k-text-center k-opacity-75">
              <div>No financial data available</div>
              <div className="k-font-size-sm">for selected date</div>
            </div>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="k-px-2 k-px-md-3 k-pb-2 k-pt-1">
          <div className="k-font-size-sm k-font-weight-bold k-mb-1">Most Profitable:</div>
          <div className="k-d-flex k-flex-col k-gap-1">
            {chartData.slice(0, 3).map((item, index) => (
              <div key={index} className="k-d-flex k-justify-content-between k-align-items-center k-p-1 k-bg-surface k-rounded k-font-size-xs">
                <div className="k-font-weight-bold">{item.campaign}</div>
                <div className={`k-font-weight-bold ${item.profit >= 0 ? 'k-color-success' : 'k-color-error'}`}>
                  {formatCurrency(item.profit)}
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
            <div style={{ marginBottom: '4px' }}><strong>Total Revenue:</strong> Sum of all income generated from campaigns on selected day</div>
            <div style={{ marginBottom: '4px' }}><strong>Total Spend:</strong> Combined advertising costs across all active campaigns</div>
            <div style={{ marginBottom: '4px' }}><strong>Net Profit:</strong> Revenue minus Spend, indicating actual return on investment</div>
            <div style={{ marginBottom: '4px' }}><strong>ROMI:</strong> Return on Marketing Investment calculated using campaignUtils functions</div>
            <div style={{ marginBottom: '4px' }}><strong>Campaign Comparison:</strong> Side-by-side analysis of spend vs revenue performance</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.8, fontStyle: 'italic', color: '#000' }}>
            💡 Use date picker to identify the most profitable days for campaign optimization
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPerformanceCard;