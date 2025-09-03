"use client";

import { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon } from '@progress/kendo-svg-icons';

const PostReachCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [visibleCampaigns, setVisibleCampaigns] = useState({});
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
        const key = `${item.campaign_name}-${item.platform}`;
        if (!campaignGroups[key]) {
          campaignGroups[key] = {
            campaign: item.campaign_name,
            platform: item.platform,
            totalCpc: 0,
            totalLeads: 0,
            totalSpend: 0,
            totalAiScore: 0,
            count: 0
          };
        }
        campaignGroups[key].totalCpc += item.cpc || 0;
        campaignGroups[key].totalLeads += item.leads || 0;
        campaignGroups[key].totalSpend += item.spend || 0;
        campaignGroups[key].totalAiScore += item.ai_score || 0;
        campaignGroups[key].count += 1;
      });

      const campaignColors = ['#007bff', '#dc3545', '#28a745', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'];
      
      const processedData = Object.values(campaignGroups).map((group, index) => ({
        x: group.totalCpc / group.count,
        y: group.totalLeads,
        size: group.totalSpend / 10,
        category: `${group.campaign} (${group.platform})`,
        color: campaignColors[index % campaignColors.length]
      }));

      setChartData(processedData);
      
      const initialVisibility = {};
      processedData.forEach(item => {
        initialVisibility[item.category] = true;
      });
      setVisibleCampaigns(initialVisibility);
    }
  }, [selectedDate, allCampaignData]);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  const handleMouseEnter = (event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const toggleCampaignVisibility = (campaignName) => {
    setVisibleCampaigns(prev => ({
      ...prev,
      [campaignName]: !prev[campaignName]
    }));
  };

  const filteredChartData = chartData.filter(item => visibleCampaigns[item.category] !== false);

  return (
    <>
      <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-12 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
        <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
          <div className="k-d-flex k-align-items-center k-gap-2">
            <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
              Campaign Performance Matrix
            </span>
            <SvgIcon 
              icon={infoCircleIcon} 
              size="small" 
              className="k-color-subtle k-cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
        
        <div className="k-px-4 k-pb-4 k-flex-1" style={{ minHeight: '362px' }}>
          {isLoading ? (
            <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '362px' }}>
              <p>Loading...</p>
            </div>
          ) : (
            chartData.length > 0 ? (
              <>
                <Chart style={{ height: '300px' }}>
                  <ChartTooltip 
                    format="{3}: CPC ${0:n2}, Leads {1}, Spend ${2:n0}" 
                    background="#fff"
                    color="#333"
                    border={{ color: '#ccc', width: 1 }}
                  />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem
                      title={{ text: 'Cost Per Click (CPC) - $' }}
                      labels={{ format: '${0:n2}' }}
                    />
                  </ChartCategoryAxis>
                  <ChartValueAxis>
                    <ChartValueAxisItem
                      title={{ text: 'Total Leads' }}
                      labels={{ format: '{0}' }}
                    />
                  </ChartValueAxis>
                  <ChartSeries>
                    <ChartSeriesItem
                      type="bubble"
                      data={filteredChartData}
                      xField="x"
                      yField="y"
                      sizeField="size"
                      categoryField="category"
                      colorField="color"
                      opacity={0.8}
                    />
                  </ChartSeries>
                </Chart>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '8px',
                  padding: '8px 0'
                }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '16px'
                  }}>
                    {chartData.map((item, index) => (
                      <div 
                        key={index} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          opacity: visibleCampaigns[item.category] === false ? 0.5 : 1
                        }}
                        onClick={() => toggleCampaignVisibility(item.category)}
                      >
                        <span 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            backgroundColor: item.color, 
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '4px'
                          }}
                        ></span>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#656565',
                          fontFamily: 'Quicksand, sans-serif',
                          fontWeight: '400',
                          lineHeight: '1.42'
                        }}>
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '362px' }}>
                <p>No data available</p>
              </div>
            )
          )}
        </div>
      </div>
      
      {showTooltip && (
        <div 
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%)',
            zIndex: 10000,
            backgroundColor: '#fff',
            color: '#333',
            padding: '12px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #ddd',
            fontSize: '13px',
            lineHeight: '1.4',
            width: '280px',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Campaign Performance Matrix</div>
          <div>X-axis: Average Cost Per Click (CPC)</div>
          <div>Y-axis: Total Leads Generated</div>
          <div>Bubble Size: Total Spend Amount</div>
          <div 
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid #fff'
            }}
          ></div>
        </div>
      )}
    </>
  );
};

export default PostReachCard;