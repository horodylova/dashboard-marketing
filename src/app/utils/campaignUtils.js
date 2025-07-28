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
  
  // Получаем последние данные для кампании за каждый день
  const latestDataByDate = getLatestDataByDate(data.data, campaignId);
  
  // Суммируем landing_page_views из последних данных за каждый день
  return Object.values(latestDataByDate)
    .reduce((total, item) => total + (item.landing_page_views || 0), 0);
}

export function calculateTotalLeads(data, campaignId) {
  if (!data || !data.data || !Array.isArray(data.data)) return 0;
  
  // Получаем последние данные для кампании за каждый день
  const latestDataByDate = getLatestDataByDate(data.data, campaignId);
  
  // Суммируем leads из последних данных за каждый день
  return Object.values(latestDataByDate)
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

// Вспомогательная функция для получения последних данных за каждый день
function getLatestDataByDate(data, campaignId) {
  const campaignData = data.filter(item => item.campaign_id === campaignId);
  const dataByDate = {};
  
  // Группируем данные по дате
  campaignData.forEach(item => {
    if (!item.date) return;
    
    if (!dataByDate[item.date]) {
      dataByDate[item.date] = [];
    }
    
    dataByDate[item.date].push(item);
  });
  
  // Для каждой даты находим последнюю запись
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
  
  // Получаем последние данные за каждый день
  const latestDataByDate = getLatestDataByDate(data.data, campaignId);
  
  // Преобразуем в формат, ожидаемый функцией calculateDailyConversion
  const groupedByDate = {};
  
  Object.keys(latestDataByDate).forEach(date => {
    groupedByDate[date] = [latestDataByDate[date]];
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