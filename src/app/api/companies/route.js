import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'companies.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const companies = JSON.parse(fileContents);
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json([{
      id: 1,
      name: '🦋 Butterfly',
      webhookUrl: '',
      isDefault: true,
      enabled: true
    }]);
  }
}

export async function POST(request) {
  try {
    const companies = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'companies.json');
    fs.writeFileSync(filePath, JSON.stringify(companies, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save companies' }, { status: 500 });
  }
}