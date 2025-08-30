"use client";

import { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip, ChartLegend } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon } from '@progress/kendo-svg-icons';

const PostReachCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const result = await response.json();
        const data = result.data || result;
        
        if (!data || !Array.isArray(data)) {
          setChartData([]);
          return;
        }
        
        const campaignGroups = {};
        data.forEach(item => {
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
        const campaignNames = [...new Set(Object.values(campaignGroups).map(g => g.campaign))];
        const colorMap = {};
        campaignNames.forEach((name, index) => {
          colorMap[name] = campaignColors[index % campaignColors.length];
        });

        const processedData = Object.values(campaignGroups).map(group => ({
          campaign: group.campaign,
          platform: group.platform,
          avgCpc: group.totalCpc / group.count,
          totalLeads: group.totalLeads,
          totalSpend: group.totalSpend,
          avgAiScore: group.totalAiScore / group.count,
          color: colorMap[group.campaign]
        }));

        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-12 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <div className="k-d-flex k-align-items-center k-gap-2">
          <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
            Campaign Performance Matrix
          </span>
          <div 
            className="k-position-relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SvgIcon 
              icon={infoCircleIcon} 
              size="small" 
              className="k-color-subtle k-cursor-pointer"
            />
          </div>
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
            <Chart style={{ height: '362px' }}>
              <ChartTooltip 
                format="{3}: CPC ${0}, Leads {1}, Spend ${2}" 
                background="#333"
                color="#fff"
                border={{ color: '#666', width: 1 }}
              />
              <ChartLegend position="right" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  title={{ text: 'Cost Per Click (CPC) - $' }}
                  labels={{ format: '${0}' }}
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  title={{ text: 'Total Leads' }}
                  labels={{ format: '{0}' }}
                />
              </ChartValueAxis>
              <ChartSeries>
                {chartData.map((item, index) => (
                  <ChartSeriesItem
                    key={index}
                    type="bubble"
                    data={[[
                      item.avgCpc,
                      item.totalLeads,
                      item.totalSpend / 10,
                      `${item.campaign} (${item.platform})`
                    ]]}
                    name={`${item.campaign} (${item.platform})`}
                    color={item.color}
                    opacity={0.9}
                  />
                ))}
              </ChartSeries>
            </Chart>
          ) : (
            <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '362px' }}>
              <p>No data available</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PostReachCard;