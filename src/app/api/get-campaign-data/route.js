import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const makeWebhookUrl = 'https://hook.eu2.make.com/wz2dy834j224f03ij1jhzhxnpfh10qrj';
    
    const response = await fetch(makeWebhookUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const rawData = await response.json();
    
    // Преобразуем данные в нужный формат
    const data = rawData.map(item => {
      if (item[1] === 'IG Story - Narrow Audience') {
        console.log('Raw IG Story data:', {
          campaign_name: item[1],
          raw_cpc: item[16],
          raw_cpc_type: typeof item[16],
          parsed_cpc: parseFloat(item[16]),
          date: item[5],
          time: item[6]
        });
      }
      
      const result = {
        campaign_id: item[0],
        campaign_name: item[1],
        platform: item[2],
        placement: item[3],
        audience: item[4],
        date: item[5],
        time: item[6],
        status: item[7],
        spend: parseFloat(item[8]) || 0,
        impressions: parseFloat(item[9]) || 0,
        reach: parseFloat(item[10]) || 0,
        clicks: parseFloat(item[11]) || 0,
        landing_page_views: parseFloat(item[12]) || 0,
        video_plays_50: parseFloat(item[13]) || 0,
        leads: parseFloat(item[14]) || 0,
        ctr: parseFloat(item[15]) || 0,
        cpc: parseFloat(item[16]) || 0,
        cpm: parseFloat(item[17]) || 0,
        ai_score: parseFloat(item[18]) || 0,
        ai_comment: item[19]
      };
      
      return result;
    });

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error fetching from Make API:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}