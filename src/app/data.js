// Используем компонент Image из next/image, но импортируем пути к изображениям правильно
import emoji_1 from '../../public/emoji_1.png';
import emoji_2 from '../../public/emoji_2.png';
import emoji_3 from '../../public/emoji_3.png';
import emoji_4 from '../../public/emoji_4.png';
import emoji_5 from '../../public/emoji_5.png';
import emoji_6 from '../../public/emoji_6.png';
import emoji_7 from '../../public/emoji_7.png';
import emoji_8 from '../../public/emoji_8.png';

export const listViewData = [
  {
    text: 'Do a research',
    checked: true,
  },
  {
    text: 'Zoom meeting with new clients',
    checked: true,
  },
  {
    text: 'Send media kits',
    checked: false,
  },
  {
    text: 'Edit videos for the YouTube channel',
    checked: false,
  },
  {
    text: 'Shoot a video for TikTok',
    checked: true,
  },
  {
    text: 'Edit the TikTok Video',
    checked: false,
  },
  {
    text: 'Post the TikTok Video',
    checked: false,
  },
  {
    text: 'Reply to YouTube comments',
    checked: false,
  },
  {
    text: 'Reply to TikTok comments',
    checked: false,
  },
];

export const drawerItems = [
  {
    id: 0,
    text: 'Dashboard',
    expandable: false,
    selected: true,
  },
  {
    id: 1,
    text: 'Analytics',
    expandable: true,
  },
  {
    id: 2,
    text: 'Members',
    expandable: true,
  },
  {
    id: 3,
    text: 'Posts',
    expandable: false,
  },
  {
    id: 4,
    text: 'Daily Tasks',
    expandable: false,
  },
  {
    id: 5,
    text: 'Schedule',
    expandable: false,
  },
  {
    id: 6,
    text: 'Settings',
    expandable: false,
  },
  { separator: true },
  {
    id: 6,
    text: 'Help',
    expandable: false,
  },
];

export const browsers = [
  {
    name: 'Mozilla Firefox',
    time: '6:11 AM',
    valueChange: '12,32',
    isRising: false,
    value: '27 968',
  },
  {
    name: 'Google Chrome',
    time: '5:24 AM',
    valueChange: '6,5',
    isRising: true,
    value: '57 074',
  },
  {
    name: 'Opera',
    time: '3:49 AM',
    valueChange: '4,17',
    isRising: true,
    value: '1640',
  },
  {
    name: 'Edge',
    time: '1:35 AM',
    valueChange: '12,32',
    isRising: false,
    value: '31 483',
  },
  {
    name: 'Android Browser',
    time: '1:08 AM',
    valueChange: '2,14',
    isRising: false,
    value: '12 624',
  },
];

export const gridData = [
  {
    time: '8:00 AM',
    postTitle: 'What Would the World Look Like Without Social Media?',
    status: 'published',
    platforms: ['instagram', 'facebook'],
  },
  {
    time: '12:00 AM',
    postTitle:
      'Principles of Psychology You Can Use to Improve Your Social Media',
    status: 'postponed',
    platforms: ['twitter'],
  },
  {
    time: '4:00 PM',
    postTitle: "Weird Hobbies That'll Make You Better at Social Media",
    status: 'pending',
    platforms: ['instagram', 'facebook'],
  },
  {
    time: '10:20 PM',
    postTitle: 'How to Grow Your Business Account?',
    status: 'pending',
    platforms: ['linkedin'],
  },
  {
    time: '4:00 PM',
    postTitle: 'What Are the Risks of Social Media?',
    status: 'pending',
    platforms: ['tiktok'],
  },
  {
    time: '10:20 PM',
    postTitle: 'How Social Media is Changing the Way We Communicate',
    status: 'pending',
    platforms: ['twitter'],
  },
];

export const drawerImages = [
  emoji_1,
  emoji_2,
  emoji_3,
  emoji_4,
  emoji_5,
  emoji_6,
  emoji_7,
  emoji_8,
];

export const followersGrowth = [
  { data: [800, 540, 400, 220], name: 'LinkedIn' },
  { data: [850, 800, 780, 600], name: 'Instagram' },
  { data: [900, 520, 290, 175], name: 'Facebook' },
  { data: [820, 390, 225, 130], name: 'YouTube' },
  { data: [900, 850, 700, 600], name: 'TikTok' },
  { data: [100, 18, 14, 9], name: 'Twitter' },
];

export const clickRateData = [
  { data: [12, 5, 7, 6, 7, 7], name: 'LinkedIn' },
  { data: [45, 28, 48, 38, 47, 47], name: 'Instagram' },
  { data: [50, 35, 75, 73, 72, 72], name: 'Facebook' },
  { data: [45, 27, 40, 32, 32, 33], name: 'YouTube' },
  { data: [42, 23, 32, 27, 27, 28], name: 'TikTok' },
  { data: [60, 35, 72, 73, 73, 74], name: 'Twitter' },
];

export const followers = [
  {
    platform: 'Instagram',
    share: 60,
    explode: false,
  },
  {
    platform: 'Facebook',
    share: 60,
    explode: false,
  },
  {
    platform: 'YouTube',
    share: 60,
    explode: false,
  },
  {
    platform: 'TikTok',
    share: 60,
    explode: false,
  },
  {
    platform: 'Twitter',
    share: 60,
    explode: false,
  },
  {
    platform: 'LinkedIn',
    share: 60,
    explode: false,
  },
];

const mockPostReachData = () => [
  {
    Timestamp: '2024-01-01T08:00:00.000',
    Viewers: [
      { number: 60, type: 'Organic' },
      { number: 200, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T09:00:00.000',
    Viewers: [
      { number: 70, type: 'Organic' },
      { number: 175, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T10:00:00.000',
    Viewers: [
      { number: 90, type: 'Organic' },
      { number: 170, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T11:00:00.000',
    Viewers: [
      { number: 75, type: 'Organic' },
      { number: 165, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T12:00:00.000',
    Viewers: [
      { number: 65, type: 'Organic' },
      { number: 160, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T13:00:00.000',
    Viewers: [
      { number: 80, type: 'Organic' },
      { number: 155, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T14:00:00.000',
    Viewers: [
      { number: 95, type: 'Organic' },
      { number: 150, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T15:00:00.000',
    Viewers: [
      { number: 90, type: 'Organic' },
      { number: 170, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T16:00:00.000',
    Viewers: [
      { number: 100, type: 'Organic' },
      { number: 160, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T17:00:00.000',
    Viewers: [
      { number: 115, type: 'Organic' },
      { number: 170, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T18:00:00.000',
    Viewers: [
      { number: 110, type: 'Organic' },
      { number: 150, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T19:00:00.000',
    Viewers: [
      { number: 100, type: 'Organic' },
      { number: 130, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T20:00:00.000',
    Viewers: [
      { number: 98, type: 'Organic' },
      { number: 120, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T21:00:00.000',
    Viewers: [
      { number: 93, type: 'Organic' },
      { number: 115, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T22:00:00.000',
    Viewers: [
      { number: 90, type: 'Organic' },
      { number: 145, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-01T23:00:00.000',
    Viewers: [
      { number: 110, type: 'Organic' },
      { number: 60, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T00:00:00.000',
    Viewers: [
      { number: 100, type: 'Organic' },
      { number: 90, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T01:00:00.000',
    Viewers: [
      { number: 80, type: 'Organic' },
      { number: 100, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T02:00:00.000',
    Viewers: [
      { number: 75, type: 'Organic' },
      { number: 110, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T03:00:00.000',
    Viewers: [
      { number: 70, type: 'Organic' },
      { number: 120, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T04:00:00.000',
    Viewers: [
      { number: 65, type: 'Organic' },
      { number: 110, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T05:00:00.000',
    Viewers: [
      { number: 60, type: 'Organic' },
      { number: 100, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T06:00:00.000',
    Viewers: [
      { number: 50, type: 'Organic' },
      { number: 110, type: 'Paid' },
    ],
  },
  {
    Timestamp: '2024-01-02T07:00:00.000',
    Viewers: [
      { number: 45, type: 'Organic' },
      { number: 130, type: 'Paid' },
    ],
  },
];

const generatePostReachData = () =>
  mockPostReachData().map((p) => {
    p.Date = new Date(p.Timestamp);
    return p;
  });

export const postReachData = generatePostReachData();