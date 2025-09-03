"use client";

export function getUniqueCampaigns(data) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  // Получаем последние данные для каждой кампании
  const campaignDataByDate = {};
  
  // Группируем данные по ID кампании и дате
  data.data.forEach(item => {
    if (!item.campaign_id) return;
    
    if (!campaignDataByDate[item.campaign_id]) {
      campaignDataByDate[item.campaign_id] = {};
    }
    
    if (!campaignDataByDate[item.campaign_id][item.date]) {
      campaignDataByDate[item.campaign_id][item.date] = [];
    }
    
    campaignDataByDate[item.campaign_id][item.date].push(item);
  });
  
  // Для каждой кампании находим последние данные
  const uniqueCampaigns = {};
  
  Object.keys(campaignDataByDate).forEach(campaignId => {
    const dates = Object.keys(campaignDataByDate[campaignId]).sort();
    const latestDate = dates[dates.length - 1];
    
    // Берем последнюю запись за последнюю дату
    const latestEntries = campaignDataByDate[campaignId][latestDate];
    latestEntries.sort((a, b) => {
      const timeA = new Date(`${a.date} ${a.time}`);
      const timeB = new Date(`${b.date} ${b.time}`);
      return timeB - timeA;
    });
    
    const latestEntry = latestEntries[0];
    
    uniqueCampaigns[campaignId] = {
      id: campaignId,
      name: latestEntry.campaign_name,
      platform: latestEntry.platform,
      ai_score: latestEntry.ai_score,
      ai_comment: latestEntry.ai_comment
    };
  });
  
  return Object.values(uniqueCampaigns);
}

export function calculateTotalLandingPageViews(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return 0;
  
  const latestDataByDate = getLatestDataByDate(data.data, campaignId);
  
  return Object.values(latestDataByDate)
    .reduce((total, item) => total + (item.landing_page_views || 0), 0);
}

export function calculateTotalLeads(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return 0;
  
  const latestDataByDate = getLatestDataByDate(data.data, campaignId);

  return Object.values(latestDataByDate)
    .reduce((total, item) => total + (item.leads || 0), 0);
}

export function getLatestSpend(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return 0;
  
  const campaignData = data.data.filter(item => item.campaign_id === campaignId);
  
  if (campaignData.length === 0) return 0;
  
  campaignData.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA;
  });
  
  return campaignData[0].spend || 0;
}

function getLatestDataByDate(data, campaignId) {
  const campaignData = data.filter(item => item.campaign_id === campaignId);
  const dataByDate = {};
  
  campaignData.forEach(item => {
    if (!item.date) return;
    
    if (!dataByDate[item.date]) {
      dataByDate[item.date] = [];
    }
    
    dataByDate[item.date].push(item);
  });
  
  const latestDataByDate = {};
  
  Object.keys(dataByDate).forEach(date => {
    const entries = dataByDate[date];
    entries.sort((a, b) => {
      const timeA = new Date(`${a.date} ${a.time}`);
      const timeB = new Date(`${b.date} ${b.time}`);
      return timeB - timeA;
    });
    
    latestDataByDate[date] = entries[0];
  });
  
  return latestDataByDate;
}

export function getActiveCampaignDates(data) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  const uniqueDates = new Set();
  
  data.data.forEach(item => {
    if (item.date) {
      uniqueDates.add(item.date);
    }
  });
  
  return Array.from(uniqueDates).sort();
}

export function groupCampaignDataByDate(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return {};
  
  const latestDataByDate = getLatestDataByDate(data.data, campaignId);
  
  const groupedByDate = {};
  
  Object.keys(latestDataByDate).forEach(date => {
    groupedByDate[date] = [latestDataByDate[date]];
  });
  
  return groupedByDate;
}

export function calculateDailyConversion(data, campaignId, date) {
  if (!data || !data.data || !Array.isArray(data.data)) return { conversion: 0, change: 0 };
  
  const groupedData = groupCampaignDataByDate(data, campaignId);
  
  if (!groupedData[date] || groupedData[date].length === 0) {
    return { conversion: 0, change: 0 };
  }
  
  const dailyData = groupedData[date].reduce(
    (acc, item) => {
      acc.clicks += item.clicks || 0;
      acc.landing_page_views += item.landing_page_views || 0;
      return acc;
    },
    { clicks: 0, landing_page_views: 0 }
  );
  
  const conversion = dailyData.landing_page_views > 0
    ? (dailyData.clicks / dailyData.landing_page_views) * 100
    : 0;
  
  const dates = Object.keys(groupedData).sort();
  const currentDateIndex = dates.indexOf(date);
  const previousDate = currentDateIndex > 0 ? dates[currentDateIndex - 1] : null;
  
  let change = 0;
  
  if (previousDate) {
    const previousDailyData = groupedData[previousDate].reduce(
      (acc, item) => {
        acc.clicks += item.clicks || 0;
        acc.landing_page_views += item.landing_page_views || 0;
        return acc;
      },
      { clicks: 0, landing_page_views: 0 }
    );
    
    const previousConversion = previousDailyData.landing_page_views > 0
      ? (previousDailyData.clicks / previousDailyData.landing_page_views) * 100
      : 0;
    
    change = previousConversion > 0
      ? ((conversion - previousConversion) / previousConversion) * 100
      : 100; 
  } else {

    change = 0;
  }
  
  return {
    conversion: parseFloat(conversion.toFixed(2)),
    change: parseFloat(change.toFixed(2))
  };
}

export function getPageViewsByDayOfWeek(data) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  const campaigns = getUniqueCampaigns(data);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return campaigns.map(campaign => {
    const campaignData = data.data.filter(item => item.campaign_id === campaign.id);
    
    const pageViewsByDay = dayNames.map(dayName => {
      const dayIndex = dayNames.indexOf(dayName);
      
      const dayData = campaignData.filter(item => {
        if (!item.date) return false;
        const date = new Date(item.date);
        return date.getDay() === (dayIndex + 1) % 7;
      });
      
      const totalViews = dayData.reduce((sum, item) => sum + (item.landing_page_views || 0), 0);
      return totalViews;
    });
    
    return {
      name: campaign.name,
      data: pageViewsByDay
    };
  });
}

export function getClicksByDayOfWeek(data) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  const campaigns = getUniqueCampaigns(data);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return campaigns.map(campaign => {
    const campaignData = data.data.filter(item => item.campaign_id === campaign.id);
    
    const clicksByDay = dayNames.map(dayName => {
      const dayIndex = dayNames.indexOf(dayName);
      
      const dayData = campaignData.filter(item => {
        if (!item.date) return false;
        const date = new Date(item.date);
        return date.getDay() === (dayIndex + 1) % 7;
      });
      
      const totalClicks = dayData.reduce((sum, item) => sum + (item.clicks || 0), 0);
      return totalClicks;
    });
    
    return {
      name: campaign.name,
      data: clicksByDay
    };
  });
}

export function getMetricComparisonData(data, selectedDate = null) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  const campaigns = getUniqueCampaigns(data);
  
  return campaigns.map(campaign => {
    let campaignData = data.data.filter(item => item.campaign_id === campaign.id);
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      campaignData = campaignData.filter(item => item.date === dateString);
    }
    
    if (campaignData.length === 0) {
      return {
        campaign: campaign.name,
        leads: 0,
        clicks: 0,
        impressions: 0
      };
    }
    
    const latestData = campaignData.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`);
      const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`);
      return dateB - dateA;
    })[0];
    
    return {
      campaign: campaign.name,
      leads: latestData.leads || 0,
      clicks: latestData.clicks || 0,
      impressions: latestData.impressions || 0
    };
  });
}

export function getCampaignPerformanceMatrix(data, selectedDate = null) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  const campaigns = getUniqueCampaigns(data);
  
  return campaigns.map(campaign => {
    let campaignData = data.data.filter(item => item.campaign_id === campaign.id);
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      campaignData = campaignData.filter(item => item.date === dateString);
    }
    
    if (campaignData.length === 0) {
      return {
        id: campaign.id,
        name: campaign.name,
        cpc: 0,
        leads: 0,
        spend: 0,
        aiScore: 0
      };
    }
    
    const latestData = campaignData.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`);
      const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`);
      return dateB - dateA;
    })[0];
    
    let cpc = latestData.cpc || 0;
    
    if (cpc === 0 && latestData.spend > 0 && latestData.leads > 0) {
      cpc = latestData.spend / latestData.leads;
    }
    
    return {
      id: campaign.id,
      name: campaign.name,
      cpc: cpc,
      leads: latestData.leads || 0,
      spend: latestData.spend || 0,
      aiScore: latestData.ai_score || 0
    };
  });
}

export function getCampaignEfficiencyData(data) {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  const campaigns = getUniqueCampaigns({ data: data });
  
  return campaigns.map(campaign => {
    const totalClicks = data
      .filter(item => item.campaign_id === campaign.id)
      .reduce((total, item) => total + (item.clicks || 0), 0);
    
    const totalLandingPageViews = data
      .filter(item => item.campaign_id === campaign.id)
      .reduce((total, item) => total + (item.landing_page_views || 0), 0);
    
    const efficiency = totalLandingPageViews > 0 
      ? (totalClicks / totalLandingPageViews) * 100 
      : 0;
    
    return {
      id: campaign.id,
      name: campaign.name,
      efficiency: Math.round(efficiency * 100) / 100
    };
  });
}

export function getCampaignEfficiencyByDayOfWeek(data, selectedDate = null) {
  if (!data || !Array.isArray(data)) return [];
  
  let filteredData = data;
  
  if (selectedDate) {
    const dateString = selectedDate.toISOString().split('T')[0];
    filteredData = data.filter(item => item.date === dateString);
  }
  
  const campaignMap = new Map();
  
  filteredData.forEach(item => {
    if (!campaignMap.has(item.campaign_id)) {
      campaignMap.set(item.campaign_id, {
        id: item.campaign_id,
        name: item.campaign_name,
        platform: item.platform,
        totalClicks: 0,
        totalLandingPageViews: 0
      });
    }
    
    const campaign = campaignMap.get(item.campaign_id);
    campaign.totalClicks += item.clicks || 0;
    campaign.totalLandingPageViews += item.landing_page_views || 0;
  });
  
  return Array.from(campaignMap.values()).map(campaign => {
    const efficiency = campaign.totalLandingPageViews > 0 
      ? (campaign.totalClicks / campaign.totalLandingPageViews) * 100 
      : 0;
    
    return {
      id: campaign.id,
      name: campaign.name,
      efficiency: Math.round(efficiency * 100) / 100,
      platform: campaign.platform
    };
  }).filter(campaign => campaign.efficiency > 0);
}

export function getMetricComparisonByDayOfWeek(data, selectedDate = null) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  let filteredData = data.data;
  
  if (selectedDate) {
    const selectedDay = selectedDate.getDay();
    filteredData = data.data.filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate.getDay() === selectedDay;
    });
  }
  
  const campaigns = getUniqueCampaigns({ data: filteredData });
  
  return campaigns.map(campaign => {
    const campaignData = filteredData.filter(item => item.campaign_id === campaign.id);
    
    if (campaignData.length === 0) {
      return {
        campaign: campaign.name,
        leads: 0,
        clicks: 0,
        impressions: 0
      };
    }
    
    const latestData = campaignData.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`);
      const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`);
      return dateB - dateA;
    })[0];
    
    return {
      campaign: campaign.name,
      leads: latestData.leads || 0,
      clicks: latestData.clicks || 0,
      impressions: latestData.impressions || 0
    };
  });
}

function calculateTotalClicks(data, campaignId) {
  if (!data || !data.data) return 0;
  
  return data.data
    .filter(item => item.campaign_id === campaignId)
    .reduce((total, item) => total + (item.clicks || 0), 0);
}