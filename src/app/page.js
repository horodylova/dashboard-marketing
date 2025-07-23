"use client";

import {
  Drawer,
  DrawerContent,
} from "@progress/kendo-react-layout";

import {
  drawerItems,
} from "./data";

import "./globals.css";

import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import CustomDrawerItem from "./components/CustomDrawerItem";
import CampaignPerformanceTrend from "./components/CampaignPerformanceTrend";
import PostReachCard from "./components/PostReachCard";
import ClickThroughRateCard from "./components/ClickThroughRateCard";
import FollowersGrowthCard from "./components/FollowersGrowthCard";
import FollowersCard from "./components/FollowersCard";
import ScheduledPostsCard from "./components/ScheduledPostsCard";
 
import CampaignsList from './components/CampaignsList';
 
import CampaignCard from './components/CampaignCard';
import CampaignEfficiencyCard from './components/CampaignEfficiencyCard';


export default function SocialMediaManagementDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignName, setCampaignName] = useState('');

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

  const handleCampaignSelect = (campaignId, name) => {
    setSelectedCampaign(campaignId);
    setCampaignName(name);
  };

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
              
         
              <CampaignsList 
                selectedCampaign={selectedCampaign}
                onCampaignSelect={handleCampaignSelect}
              />
              
              <CampaignEfficiencyCard/>

              <CampaignPerformanceTrend 
                selectedCampaign={selectedCampaign}
                campaignName={campaignName}
              />

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
