const fs = require('fs');
const path = require('path');

function updateCampaignDates() {
  const jsonPath = path.join(__dirname, 'public', 'campaign-data.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);
  
  const dateMapping = {
    '2025-08-24': 0,
    '2025-08-25': 1,
    '2025-08-26': 2,
    '2025-08-27': 3,
    '2025-08-28': 4,
    '2025-08-29': 5,
    '2025-08-30': 6
  };
  
  data.forEach(item => {
    if (dateMapping.hasOwnProperty(item.date)) {
      const dayOffset = dateMapping[item.date];
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + dayOffset);
      item.date = newDate.toISOString().split('T')[0];
    }
  });
  
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log('Campaign dates updated successfully!');
}

updateCampaignDates();