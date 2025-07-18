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
import ToDoListCard from './components/ToDoListCard';
import DrawerLayout from "./components/DrawerLayout";
import CampaignCard from './components/CampaignCard';
import CampaignEfficiencyCard from './components/CampaignEfficiencyCard';

const ToDoListItemRender = (props) => {
  return (
    <div
      role="listitem"
      className="k-d-flex k-justify-content-between k-px-2 k-py-1"
    >
      <div className="k-d-flex k-align-items-center">
        <label className="k-checkbox-label">
          <Checkbox checked={props.dataItem.checked} />
          {props.dataItem.text}
        </label>
      </div>
      <div className="k-white-space-nowrap">
        <Button
          title="Edit To Do"
          svgIcon={pencilIcon}
          fillMode="flat"
          size="small"
        />
        <Button
          title="Delete To Do"
          svgIcon={trashIcon}
          fillMode="flat"
          size="small"
          themeColor="error"
        />
      </div>
    </div>
  );
};

const BrowserUsageItemRender = (props) => {
  let walletClass =
    "k-font-size-sm k-line-height-lg k-font-weight-bold k-color-success";
  if (props.dataItem.inDebt) {
    walletClass = walletClass + " " + "k-color-error";
  } else {
    walletClass = walletClass + " " + "k-color-success";
  }
  return (
    <div
      role="listitem"
      className="k-d-flex k-gap-3 k-border-b k-border-b-solid k-border-border k-p-2"
    >
      <div>
        {props.index !== undefined && listViewSvgIcons[props.index].svg}
      </div>
      <div className="k-d-flex k-flex-col k-flex-1">
        <span className="k-font-size-md">{props.dataItem.name}</span>
        <span className="k-font-size-sm k-color-subtle  ">
          {props.dataItem.time}
        </span>
      </div>
      <div className="k-d-flex k-flex-col k-align-items-end">
        <span
          className={
            props.dataItem.isRising
              ? "k-font-size-sm k-color-success k-font-weight-bold"
              : "k-font-size-sm k-color-error k-font-weight-bold"
          }
        >
          <SvgIcon
            icon={props.dataItem.isRising ? arrowUpIcon : arrowDownIcon}
          />
          {props.dataItem.valueChange}%
        </span>
        <span className="k-font-size-sm k-color-subtle">27 968</span>
      </div>
    </div>
  );
};

const PlatformCell = (props) => {
  let svgs = [];
  props.dataItem.platforms.map((platform) => {
    gridSvgIcons.map((social) => {
      if (platform === social.name) {
        svgs.push(social.svg);
      }
    });
  });
  return (
    <td {...props.tdProps} colSpan={1}>
      {svgs.map((svg) => {
        return (
          <React.Fragment key={`social-${React.useId()}`}>{svg}</React.Fragment>
        );
      })}
    </td>
  );
};

const StatusCell = (props) => {
  const themeColor =
    props.dataItem.status === "published"
      ? "success"
      : props.dataItem.status === "postponed"
        ? "error"
        : "warning";
  return (
    <td {...props.tdProps} colSpan={1}>
      <BadgeContainer>
        <Badge themeColor={themeColor} rounded="medium" position="outside">
          {props.dataItem.status.charAt(0).toUpperCase() +
            props.dataItem.status.slice(1)}
        </Badge>
      </BadgeContainer>
    </td>
  );
};

const ActionCell = (props) => {
  return (
    <td {...props.tdProps} colSpan={1} className="k-command-cell">
      <Button
        title="Edit Scheduled Post"
        svgIcon={pencilIcon}
        fillMode="flat"
        size="small"
      />
      <Button
        title="Delete Scheduled Post"
        svgIcon={trashIcon}
        fillMode="flat"
        size="small"
        themeColor="error"
      />
    </td>
  );
};

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
      {/* Using Header component */}
      <Header />
      {/* END OF TPNAV-L-1 */}

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
              <h1 className="k-h1 k-py-6 k-px-10 !k-mb-0">Hello, admin!</h1>
            </div>
            <div className="k-d-grid k-grid-cols-xs-1 k-grid-cols-md-6 k-grid-cols-xl-12 k-grid-auto-rows-auto k-gap-4 k-px-xs-4 k-px-md-6 k-px-xl-10">
              {/* Campaign Cards - занимает полную ширину ряда */}
              <CampaignCard />
              
              {/* ToDoListCard - начинается с нового ряда */}
              <ToDoListCard/>
              
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
