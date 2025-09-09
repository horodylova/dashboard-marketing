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
import FinancialPerformanceCard from './components/FinancialPerformanceCard';
import MarketingEfficiencyCard from './components/MarketingEfficiencyCard';
import  Footer from './components/Footer'

export default function SocialMediaManagementDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
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
       
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    fetchCampaignData();
  }, []);

  const handleCampaignSelect = (campaignData) => {
    if (campaignData) {
      setSelectedCampaign(campaignData);
      setCampaignName(campaignData.text);
    } else {
      setSelectedCampaign(null);
      setCampaignName('');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
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
            {isMobile ? (
              <div className="k-d-flex k-flex-col k-gap-4 k-px-4" style={{ paddingBottom: '2rem' }}>
                <CampaignCard />
                <CampaignsList 
                  selectedCampaign={selectedCampaign}
                  onCampaignSelect={handleCampaignSelect}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
                <CampaignPerformanceTrend 
                  selectedCampaign={selectedCampaign}
                  campaignName={campaignName}
                  selectedDate={selectedDate}
                />
                <CampaignEfficiencyCard/>
                <FollowersCard />
                <ScheduledPostsCard />
                <FollowersGrowthCard />
                <ClickThroughRateCard />
                <PostReachCard />
              </div>
            ) : isTablet ? (
              <div className="k-d-grid k-grid-cols-2 k-gap-4 k-px-4 k-px-md-6" style={{ paddingBottom: '2rem', gridAutoRows: 'min-content' }}>
                <div className="k-col-span-2" style={{ minHeight: '200px' }}>
                  <CampaignCard />
                </div>
                <div style={{ minHeight: '400px', minWidth: '0' }}>
                  <CampaignsList 
                    selectedCampaign={selectedCampaign}
                    onCampaignSelect={handleCampaignSelect}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                  />
                </div>
                <div style={{ minHeight: '400px', minWidth: '0' }}>
                  <CampaignPerformanceTrend 
                    selectedCampaign={selectedCampaign}
                    campaignName={campaignName}
                    selectedDate={selectedDate}
                  />
                </div>
                <div style={{ minHeight: '300px', minWidth: '0' }}>
                  <CampaignEfficiencyCard/>
                </div>
                <div style={{ minHeight: '300px', minWidth: '0' }}>
                  <FollowersCard />
                </div>
                <div className="k-col-span-2" style={{ minHeight: '300px' }}>
                  <ScheduledPostsCard />
                </div>
                <div style={{ minHeight: '400px', minWidth: '0' }}>
                  <FollowersGrowthCard />
                </div>
                <div style={{ minHeight: '400px', minWidth: '0' }}>
                  <ClickThroughRateCard />
                </div>
                <div style={{ minHeight: '400px', minWidth: '0' }}>
                  <FinancialPerformanceCard />
                </div>
                <div style={{ minHeight: '400px', minWidth: '0' }}>
                  <MarketingEfficiencyCard />
                </div>
                <div className="k-col-span-2" style={{ minHeight: '400px' }}>
                  <PostReachCard />
                </div>
              </div>
            ) : (
              <div className="k-d-grid k-grid-cols-xs-1 k-grid-cols-md-6 k-grid-cols-xl-12 k-grid-auto-rows-auto k-gap-4 k-px-xs-4 k-px-md-6 k-px-xl-10" style={{ paddingBottom: '2rem' }}>
                <CampaignCard />
                <CampaignsList 
                  selectedCampaign={selectedCampaign}
                  onCampaignSelect={handleCampaignSelect}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
                <CampaignPerformanceTrend 
                  selectedCampaign={selectedCampaign}
                  campaignName={campaignName}
                  selectedDate={selectedDate}
                />
                <CampaignEfficiencyCard/>
                <FollowersCard />
                <ScheduledPostsCard />
                <FollowersGrowthCard />
                <ClickThroughRateCard />
               <FinancialPerformanceCard />
                <MarketingEfficiencyCard />
                <PostReachCard />
              </div>
            )}
          </main>
          <Footer/>
        </div>
      </div>
    </>
  );
}