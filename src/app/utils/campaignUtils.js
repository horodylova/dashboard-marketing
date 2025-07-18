"use client";

export function getUniqueCampaigns(data) {
  if (!data || !data.data || !Array.isArray(data.data)) return [];
  
  const uniqueCampaignIds = {};
  
  data.data.forEach(item => {
    if (item.campaign_id && !uniqueCampaignIds[item.campaign_id]) {
      uniqueCampaignIds[item.campaign_id] = {
        id: item.campaign_id,
        name: item.campaign_name,
        platform: item.platform
      };
    }
  });
  
  return Object.values(uniqueCampaignIds).slice(0, 4);
}

export function calculateTotalLandingPageViews(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return 0;
  
  return data.data
    .filter(item => item.campaign_id === campaignId)
    .reduce((total, item) => total + (item.landing_page_views || 0), 0);
}

export function calculateTotalLeads(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return 0;
  
  return data.data
    .filter(item => item.campaign_id === campaignId)
    .reduce((total, item) => total + (item.leads || 0), 0);
}

export function getLatestSpend(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return 0;
  
  const campaignData = data.data.filter(item => item.campaign_id === campaignId);
  
  if (campaignData.length === 0) return 0;
  
  // Сортируем по дате и времени (от новых к старым)
  campaignData.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA;
  });
  
  // Возвращаем значение spend из последней записи
  return campaignData[0].spend || 0;
}

// Новые функции для расчета конверсии и отслеживания изменений по дням

// Получение активных дат кампаний
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

// Группировка данных кампании по дням
export function groupCampaignDataByDate(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return {};
  
  const campaignData = data.data.filter(item => item.campaign_id === campaignId);
  const groupedByDate = {};
  
  campaignData.forEach(item => {
    if (!item.date) return;
    
    if (!groupedByDate[item.date]) {
      groupedByDate[item.date] = [];
    }
    
    groupedByDate[item.date].push(item);
  });
  
  return groupedByDate;
}

// Расчет конверсии для кампании за день
export function calculateDailyConversion(data, campaignId, date) {
  if (!data || !data.data || !Array.isArray(data.data)) return { conversion: 0, change: 0 };
  
  const groupedData = groupCampaignDataByDate(data, campaignId);
  
  if (!groupedData[date] || groupedData[date].length === 0) {
    return { conversion: 0, change: 0 };
  }
  
  // Суммируем clicks и landing_page_views за день
  const dailyData = groupedData[date].reduce(
    (acc, item) => {
      acc.clicks += item.clicks || 0;
      acc.landing_page_views += item.landing_page_views || 0;
      return acc;
    },
    { clicks: 0, landing_page_views: 0 }
  );
  
  // Рассчитываем конверсию
  const conversion = dailyData.landing_page_views > 0
    ? (dailyData.clicks / dailyData.landing_page_views) * 100
    : 0;
  
  // Находим предыдущий день
  const dates = Object.keys(groupedData).sort();
  const currentDateIndex = dates.indexOf(date);
  const previousDate = currentDateIndex > 0 ? dates[currentDateIndex - 1] : null;
  
  // Рассчитываем изменение по сравнению с предыдущим днем
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
      : 100; // Если предыдущая конверсия была 0, считаем рост как 100%
  } else {
    // Если это первый день, считаем, что изменений нет
    change = 0;
  }
  
  return {
    conversion: parseFloat(conversion.toFixed(2)),
    change: parseFloat(change.toFixed(2))
  };
}