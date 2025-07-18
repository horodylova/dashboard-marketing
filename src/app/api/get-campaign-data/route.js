import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const credentialsPath = path.join(process.cwd(), 'keys', 'nextjssheetsapi-a37754115bd4.json');
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf-8'));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '19eynqTiwxtbIweEKtGPTAWa8JqwKT8EdYxeKjnOex60';
    const range = 'Campaigns Data!A:R'; 

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ data: [] });
    }

 
    const headers = [
        "campaign_id", "campaign_name", "platform", "placement", "audience",
        "date", "time", "status", "spend", "impressions", "reach", "clicks",
        "landing_page_views", "video_plays_50", "leads", "ctr", "cpc", "cpm"
    ];


    const data = rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, index) => {
       
        if (["spend", "impressions", "reach", "clicks", "landing_page_views", "video_plays_50", "leads", "ctr", "cpc", "cpm"].includes(header)) {
            obj[header] = parseFloat(row[index]) || 0; 
        } else {
            obj[header] = row[index];
        }
      });
      return obj;
    });

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error fetching from Google Sheets API:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}