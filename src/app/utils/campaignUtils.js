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