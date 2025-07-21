"use client";

import Image from "next/image";

import {
  Drawer,
  DrawerContent,
  DrawerItem,
} from "@progress/kendo-react-layout";
import { SvgIcon } from "@progress/kendo-react-common";
import { Checkbox } from "@progress/kendo-react-inputs";
import {
  arrowDownIcon,
  arrowUpIcon,
  checkIcon,
  chevronDownIcon,
  xIcon,
} from "@progress/kendo-svg-icons";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import { Button, Chip } from "@progress/kendo-react-buttons";
import {
  DatePicker,
  DateInput,
  MultiViewCalendar,
} from "@progress/kendo-react-dateinputs";
import { ListView } from "@progress/kendo-react-listview";
import { pencilIcon, trashIcon } from "@progress/kendo-svg-icons";
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartSeriesLabels,
} from "@progress/kendo-react-charts";

import { Grid, GridColumn } from "@progress/kendo-react-grid";

import { listViewSvgIcons, gridSvgIcons } from "./svg-icons";

import {
  listViewData,
  drawerItems,
  browsers,
  gridData,
  drawerImages,
  followersGrowth,
  clickRateData,
  followers,
  postReachData,
} from "./data";

import "./globals.css";

import React, { useEffect } from "react";

import Header from "./components/Header";
import CustomDrawerItem from "./components/CustomDrawerItem";
import CalendarPanel from "./components/CalendarPanel";
import PostReachCard from "./components/PostReachCard";
import ClickThroughRateCard from "./components/ClickThroughRateCard";
import FollowersGrowthCard from "./components/FollowersGrowthCard";
import FollowersCard from "./components/FollowersCard";
import ScheduledPostsCard from "./components/ScheduledPostsCard";
import BrowserUsageCard from "./components/BrowserUsageCard";
import CampaignsList from './components/CampaignsList';
import DrawerLayout from "./components/DrawerLayout";
import CampaignCard from './components/CampaignCard';
import CampaignEfficiencyCard from './components/CampaignEfficiencyCard';


export default function SocialMediaManagementDashboard() {
  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        console.log('Campaign data fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    fetchCampaignData();
  }, []);

  return (
    <>
      
      <Header />
    

      <Drawer
        expanded={true}
        className="!k-flex-none !k-pos-sticky"
        style={{ height: "calc(100vh - 46px)", top: "46px" }}
        mode="push"
        width={248}
        items={drawerItems}
        item={CustomDrawerItem}
      >
        <DrawerContent style={{ background: "var(--panel-gradient)" }}>
          <main>
            <div className="k-bg-primary k-color-white">
              <h1 className="k-h1 k-py-6 k-px-10 !k-mb-0">Active Campaigns</h1>
            </div>
            <div className="k-d-grid k-grid-cols-xs-1 k-grid-cols-md-6 k-grid-cols-xl-12 k-grid-auto-rows-auto k-gap-4 k-px-xs-4 k-px-md-6 k-px-xl-10">
           
              <CampaignCard />
              
         
              <CampaignsList/>
              
              <CampaignEfficiencyCard/>

              <CalendarPanel />

              <FollowersCard />

              <ScheduledPostsCard />

              <FollowersGrowthCard />

              <ClickThroughRateCard />

              <PostReachCard />
            </div>
          </main>
          <footer className="!k-bg-primary k-color-white k-mt-4 k-bg-light k-py-6 k-px-10">
            <p className="!k-mb-0">
              Copyright &#169; 2024 Progress Software. All rights reserved.
            </p>
          </footer>
        </DrawerContent>
      </Drawer>
    </>
  );
}
