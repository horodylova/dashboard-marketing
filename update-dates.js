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
    '2025-01-20': 0, // Monday
    '2025-01-21': 1, // Tuesday  
    '2025-01-22': 2, // Wednesday
    '2025-01-23': 3, // Thursday
    '2025-01-24': 4, // Friday
    '2025-01-25': 5, // Saturday
    '2025-01-26': 6  // Sunday
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