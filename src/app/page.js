"use client";

import "./globals.css";

import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import CompanyDrawerSection from "./components/CompanyDrawerSection";
import CampaignPerformanceTrend from "./components/CampaignPerformanceTrend";
import PostReachCard from "./components/PostReachCard";
import ClickThroughRateCard from "./components/ClickThroughRateCard";
import FollowersGrowthCard from "./components/FollowersGrowthCard";
import FollowersCard from "./components/FollowersCard";
import ScheduledPostsCard from "./components/ScheduledPostsCard";
import CampaignsList from './components/CampaignsList';
import CampaignCard from './components/CampaignCard';
import CampaignEfficiencyCard from './components/CampaignEfficiencyCard';
import  Footer from './components/Footer'

export default function SocialMediaManagementDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setDrawerExpanded(true);
        setIsMobileMenuOpen(false);
      } else {
        setDrawerExpanded(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const toggleDrawer = () => {
    setDrawerExpanded(!drawerExpanded);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Header 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
        isMobile={isMobile}
      />

      {!isMobile && !drawerExpanded && (
        <button
          onClick={toggleDrawer}
          style={{
            position: 'fixed',
            left: '10px',
            top: '60px',
            zIndex: 1000,
            background: 'var(--kendo-color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          ▶
        </button>
      )}

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 46px)' }}>
        {!isMobile && drawerExpanded && (
          <div 
            style={{
              width: '320px',
              minWidth: '320px',
              maxWidth: '320px',
              flexShrink: 0,
              background: 'white',
              borderRight: '1px solid #e0e0e0',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}
          >
            <button
              onClick={toggleDrawer}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'var(--kendo-color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
                zIndex: 10
              }}
            >
              ◀
            </button>
            <CompanyDrawerSection />
          </div>
        )}
        
        <div style={{ 
          flex: 1, 
          background: "var(--panel-gradient)",
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 46px)'
        }}>
          <main style={{ flex: 1 }}>
            <div className="k-bg-primary k-color-white">
              <h1 className="k-h1 k-py-6 k-px-4 k-px-md-6 k-px-xl-10 !k-mb-0">Active Campaigns</h1>
            </div>
            <div className={`${isMobile ? 'k-d-flex k-flex-col k-gap-4 k-px-4' : 'k-d-grid k-grid-cols-xs-1 k-grid-cols-md-6 k-grid-cols-xl-12 k-grid-auto-rows-auto k-gap-4 k-px-xs-4 k-px-md-6 k-px-xl-10'}`} style={{ paddingBottom: '2rem' }}>
              <CampaignCard />
              <CampaignsList 
                selectedCampaign={selectedCampaign}
                onCampaignSelect={handleCampaignSelect}
              />
              <CampaignPerformanceTrend 
                selectedCampaign={selectedCampaign}
                campaignName={campaignName}
              />
              <CampaignEfficiencyCard/>
              <FollowersCard />
              <ScheduledPostsCard />
              <FollowersGrowthCard />
              <ClickThroughRateCard />
              <PostReachCard />
            </div>
          </main>
          <Footer/>
        </div>
      </div>
    </>
  );
}
