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

import React from "react";

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
              {/* CMPCTCARD-L-7 -> Compact card */}
              <div className="k-d-flex k-flex-col k-col-span-md-2 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
                <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
                  {/* Instagram image SVG image */}
                  <div className="k-d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_669_2717)">
                        <path
                          d="M16.8503 0H7.14973C3.20735 0 0 3.20735 0 7.14973V16.8503C0 20.7926 3.20735 24 7.14973 24H16.8503C20.7926 24 24 20.7926 24 16.8503V7.14973C24 3.20735 20.7926 0 16.8503 0ZM21.5856 16.8503C21.5856 19.4655 19.4655 21.5856 16.8503 21.5856H7.14973C4.5345 21.5856 2.4144 19.4655 2.4144 16.8503V7.14973C2.4144 4.53446 4.5345 2.4144 7.14973 2.4144H16.8503C19.4655 2.4144 21.5856 4.53446 21.5856 7.14973V16.8503Z"
                          fill="url(#paint0_linear_669_2717)"
                        />
                        <path
                          d="M12.0002 5.79297C8.57754 5.79297 5.79297 8.57754 5.79297 12.0002C5.79297 15.4228 8.57754 18.2074 12.0002 18.2074C15.4229 18.2074 18.2075 15.4229 18.2075 12.0002C18.2075 8.57749 15.4229 5.79297 12.0002 5.79297ZM12.0002 15.7931C9.90547 15.7931 8.20737 14.095 8.20737 12.0002C8.20737 9.90547 9.90551 8.20737 12.0002 8.20737C14.095 8.20737 15.7931 9.90547 15.7931 12.0002C15.7931 14.0949 14.0949 15.7931 12.0002 15.7931Z"
                          fill="url(#paint1_linear_669_2717)"
                        />
                        <path
                          d="M18.2188 7.32682C19.0403 7.32682 19.7062 6.6609 19.7062 5.83944C19.7062 5.01798 19.0403 4.35205 18.2188 4.35205C17.3974 4.35205 16.7314 5.01798 16.7314 5.83944C16.7314 6.6609 17.3974 7.32682 18.2188 7.32682Z"
                          fill="url(#paint2_linear_669_2717)"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_669_2717"
                          x1="12"
                          y1="23.9301"
                          x2="12"
                          y2="0.186412"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#E09B3D" />
                          <stop offset="0.3" stopColor="#C74C4D" />
                          <stop offset="0.6" stopColor="#C21975" />
                          <stop offset="1" stopColor="#7024C4" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_669_2717"
                          x1="12.0002"
                          y1="23.9304"
                          x2="12.0002"
                          y2="0.186637"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#E09B3D" />
                          <stop offset="0.3" stopColor="#C74C4D" />
                          <stop offset="0.6" stopColor="#C21975" />
                          <stop offset="1" stopColor="#7024C4" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_669_2717"
                          x1="18.2188"
                          y1="23.9302"
                          x2="18.2188"
                          y2="0.186501"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#E09B3D" />
                          <stop offset="0.3" stopColor="#C74C4D" />
                          <stop offset="0.6" stopColor="#C21975" />
                          <stop offset="1" stopColor="#7024C4" />
                        </linearGradient>
                        <clipPath id="clip0_669_2717">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  {/* End of Instagram SVG image */}
                  <div className="k-font-size-lg k-font-weight-bold">
                    @your.account
                  </div>
                </div>
                <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
                  <div>112k followers</div>
                  <div>3.5m likes</div>
                  <div>20m views</div>
                </div>
              </div>
              {/* End of CMPCTCARD-L-7 */}

              {/* CMPCTCARD-L-7 -> Compact card */}
              <div className="k-d-flex k-flex-col k-col-span-md-2 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
                <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
                  {/* Facebook SVG image */}
                  <div className="k-d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g id="socials logo" clipPath="url(#clip0_701_22303)">
                        <path
                          id="Vector"
                          d="M20.7657 0H3.23405C1.44797 0 0 1.44791 0 3.23405V20.7658C0 22.552 1.44791 23.9999 3.23405 23.9999H11.8806L11.8953 15.4236H9.66721C9.37765 15.4236 9.14264 15.1895 9.14152 14.8999L9.13084 12.1354C9.12972 11.8443 9.36544 11.6077 9.65658 11.6077H11.8806V8.93651C11.8806 5.83661 13.7739 4.14869 16.5392 4.14869H18.8083C19.0986 4.14869 19.3341 4.38406 19.3341 4.67444V7.00547C19.3341 7.29573 19.0988 7.53104 18.8086 7.53122L17.4161 7.53187C15.9122 7.53187 15.621 8.24648 15.621 9.29522V11.6078H18.9255C19.2404 11.6078 19.4847 11.8827 19.4476 12.1954L19.1199 14.9599C19.0885 15.2244 18.8642 15.4237 18.5978 15.4237H15.6357L15.621 24H20.7658C22.5519 24 23.9998 22.5521 23.9998 20.766V3.23405C23.9998 1.44791 22.5519 0 20.7657 0Z"
                          fill="#475993"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_701_22303">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  {/* End of Facebook SVG image */}
                  <div className="k-font-size-lg k-font-weight-bold">
                    @your.account
                  </div>
                </div>
                <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
                  <div>112k followers</div>
                  <div>3.5m likes</div>
                  <div>20m views</div>
                </div>
              </div>
              {/* End of CMPCTCARD-L-7 */}

              {/* CMPCTCARD-L-7 -> Compact card */}
              <div className="k-d-flex k-flex-col k-col-span-md-2 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
                <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
                  {/* Youtube SVG image */}
                  <div className="k-d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g id="socials logo">
                        <path
                          id="Vector"
                          d="M19.0155 3.5083H4.98449C2.23163 3.5083 0 5.73993 0 8.49279V15.5068C0 18.2597 2.23163 20.4913 4.98449 20.4913H19.0155C21.7684 20.4913 24 18.2597 24 15.5068V8.49279C24 5.73993 21.7684 3.5083 19.0155 3.5083ZM15.6445 12.3411L9.08177 15.4711C8.9069 15.5545 8.7049 15.427 8.7049 15.2333V8.77757C8.7049 8.58109 8.91221 8.45375 9.08744 8.54256L15.6502 11.8682C15.8453 11.9671 15.8419 12.2469 15.6445 12.3411Z"
                          fill="#F61C0D"
                        />
                      </g>
                    </svg>
                  </div>
                  {/* End of Youtube SVG image */}
                  <div className="k-font-size-lg k-font-weight-bold">
                    @your.account
                  </div>
                </div>
                <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
                  <div>112k followers</div>
                  <div>3.5m likes</div>
                  <div>20m views</div>
                </div>
              </div>
              {/* End of CMPCTCARD-L-7 */}

              {/* CMPCTCARD-L-7 -> Compact card */}
              <div className="k-d-flex k-flex-col k-col-span-md-2 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
                <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
                  {/* TikTok SVG image */}
                  <div className="k-d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g id="socials logo">
                        <path
                          id="Vector"
                          d="M9.71997 9.44142V8.50753C9.3958 8.4562 9.06837 8.42806 8.74018 8.42336C5.56288 8.41658 2.74992 10.4756 1.79577 13.5062C0.841618 16.5368 1.96788 19.8359 4.57586 21.6506C3.61951 20.627 2.97984 19.3486 2.73406 17.9695C2.48829 16.5905 2.64691 15.1698 3.19079 13.8789C3.73467 12.588 4.64055 11.4821 5.79909 10.6947C6.95764 9.9073 8.31932 9.47208 9.71978 9.44154L9.71997 9.44142Z"
                          fill="#25F4EE"
                        />
                        <path
                          id="Vector_2"
                          d="M9.89697 20.0203C11.6734 20.0179 13.1336 18.6184 13.2114 16.8436V1.00621H16.1047C16.0457 0.675276 16.0175 0.339567 16.0206 0.00341797H12.0631V15.8256C11.9973 17.6093 10.5336 19.0223 8.74864 19.0252C8.21525 19.0206 7.69054 18.8895 7.21777 18.6425C7.52418 19.067 7.9266 19.4131 8.3922 19.6525C8.85781 19.892 9.37341 20.018 9.89697 20.0203ZM21.5089 6.37968V5.49937C20.4441 5.4998 19.4028 5.18561 18.516 4.59622C19.2934 5.50003 20.344 6.12605 21.5089 6.37968Z"
                          fill="#25F4EE"
                        />
                        <path
                          id="Vector_3"
                          d="M18.5157 4.59603C17.642 3.6012 17.1604 2.32231 17.1608 0.998291H16.1044C16.2409 1.73033 16.525 2.42688 16.9396 3.04544C17.3542 3.664 17.8905 4.19159 18.5157 4.59603ZM8.74074 12.3808C7.99984 12.3846 7.28144 12.6359 6.69978 13.0949C6.11811 13.5538 5.70659 14.194 5.53063 14.9138C5.35463 15.6335 5.42429 16.3914 5.72856 17.067C6.03279 17.7426 6.55417 18.297 7.20975 18.6423C6.85128 18.1473 6.63666 17.563 6.5895 16.9537C6.54238 16.3445 6.66456 15.7341 6.94257 15.1899C7.22062 14.6458 7.64366 14.1891 8.165 13.8703C8.6863 13.5515 9.28562 13.383 9.89668 13.3835C10.2289 13.3878 10.5588 13.4395 10.8764 13.537V9.51029C10.552 9.46164 10.2246 9.43607 9.89668 9.43377H9.72052V12.4956C9.40125 12.4099 9.07118 12.3713 8.74074 12.3808Z"
                          fill="#FE2C55"
                        />
                        <path
                          id="Vector_4"
                          d="M21.5084 6.37964V9.44153C19.5371 9.43771 17.617 8.81371 16.02 7.65799V15.703C16.0115 19.7174 12.7549 22.9673 8.7405 22.9673C7.24959 22.97 5.79458 22.5099 4.57617 21.6507C5.5697 22.7193 6.86203 23.464 8.2848 23.7877C9.70754 24.1113 11.1949 23.9991 12.5529 23.4655C13.9109 22.9319 15.0768 22.0016 15.8987 20.796C16.7206 19.5904 17.1603 18.1651 17.1606 16.706V8.68375C18.7629 9.83189 20.6854 10.4477 22.6566 10.4443V6.50182C22.2706 6.50067 21.8859 6.45972 21.5084 6.37964Z"
                          fill="#FE2C55"
                        />
                        <path
                          id="Vector_5"
                          d="M16.0202 15.7029V7.65785C17.622 8.80698 19.5448 9.42294 21.5161 9.41839V6.35661C20.3515 6.11064 19.2984 5.49272 18.5156 4.59603C17.8904 4.19159 17.3541 3.664 16.9395 3.04544C16.5249 2.42688 16.2408 1.73033 16.1043 0.998291H13.211V16.8437C13.1829 17.5334 12.9405 18.1972 12.5178 18.7428C12.0949 19.2885 11.5127 19.6889 10.8518 19.8884C10.191 20.0879 9.48441 20.0766 8.83029 19.856C8.1762 19.6355 7.60701 19.2166 7.20189 18.6577C6.54623 18.3125 6.02474 17.7581 5.72043 17.0825C5.41609 16.4068 5.34638 15.6489 5.52238 14.9291C5.69838 14.2093 6.10994 13.569 6.69168 13.11C7.27343 12.651 7.99193 12.3997 8.73291 12.396C9.06523 12.399 9.39534 12.4506 9.7127 12.5492V9.48729C8.30474 9.51117 6.9341 9.94417 5.76797 10.7336C4.60181 11.5229 3.69055 12.6345 3.14525 13.9329C2.59996 15.2312 2.4442 16.6601 2.69697 18.0455C2.94974 19.4308 3.60012 20.7126 4.56881 21.7347C5.79917 22.5656 7.25624 22.9961 8.74064 22.9671C12.755 22.9671 16.0117 19.7172 16.0202 15.7029Z"
                          fill="black"
                        />
                      </g>
                    </svg>
                  </div>
                  {/* End of TikTok SVG image */}
                  <div className="k-font-size-lg k-font-weight-bold">
                    @your.account
                  </div>
                </div>
                <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
                  <div>112k followers</div>
                  <div>3.5m likes</div>
                  <div>20m views</div>
                </div>
              </div>
              {/* End of CMPCTCARD-L-7 */}

              {/* CMPCTCARD-L-7 -> Compact card */}
              <div className="k-d-flex k-flex-col k-col-span-md-2 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
                <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
                  {/* Twitter SVG image */}
                  <div className="k-d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="22"
                      viewBox="0 0 24 22"
                      fill="none"
                    >
                      <g id="twitter logo">
                        <path
                          id="Vector"
                          d="M23.8413 3.43714C22.9677 3.82594 22.0269 4.08514 21.0429 4.20514C22.0509 3.60034 22.8189 2.64514 23.1837 1.51234C22.2429 2.06434 21.2013 2.47234 20.0925 2.68834C19.2045 1.74274 17.9373 1.15234 16.5357 1.15234C13.8429 1.15234 11.6637 3.33154 11.6637 6.02434C11.6637 6.40834 11.7069 6.77794 11.7885 7.13314C7.7421 6.93154 4.1517 4.99234 1.7469 2.04514C1.3293 2.76514 1.0893 3.60034 1.0893 4.49314C1.0893 6.18274 1.9485 7.67554 3.2541 8.54914C2.4573 8.52514 1.7037 8.30434 1.0461 7.93954C1.0461 7.95874 1.0461 7.97794 1.0461 8.00194C1.0461 10.3635 2.7261 12.3315 4.9533 12.7779C4.5453 12.8883 4.1133 12.9507 3.6717 12.9507C3.3597 12.9507 3.0525 12.9219 2.7549 12.8643C3.3741 14.7987 5.1741 16.2099 7.3053 16.2483C5.6397 17.5539 3.5373 18.3315 1.2573 18.3315C0.863703 18.3315 0.474903 18.3075 0.0957031 18.2643C2.2509 19.6467 4.8141 20.4531 7.5645 20.4531C16.5261 20.4531 21.4269 13.0323 21.4269 6.59074C21.4269 6.37954 21.4221 6.16834 21.4125 5.96194C22.3629 5.27074 23.1885 4.41154 23.8413 3.43714Z"
                          fill="#5FA9DD"
                        />
                      </g>
                    </svg>
                  </div>
                  {/* End of Twitter SVG image */}
                  <div className="k-font-size-lg k-font-weight-bold">
                    @your.account
                  </div>
                </div>
                <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
                  <div>112k followers</div>
                  <div>3.5m likes</div>
                  <div>20m views</div>
                </div>
              </div>
              {/* End of CMPCTCARD-L-7 */}

              {/* CMPCTCARD-L-7 -> Compact card */}
              <div className="k-d-flex k-flex-col k-col-span-md-2 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
                <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
                  {/* Linkedin SVG image */}
                  <div className="k-d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g id="socials logo" clipPath="url(#clip0_701_25203)">
                        <path
                          id="Vector"
                          d="M22.2225 0.000976562H1.7715C0.795 0.000976562 0 0.775727 0 1.72973V22.2677C0 23.224 0.795 24.0002 1.7715 24.0002H22.224C23.2027 24.0002 24 23.224 24 22.2677V1.72973C24 0.775727 23.2027 0.000976562 22.2225 0.000976562Z"
                          fill="#0177B5"
                        />
                        <path
                          id="Vector_2"
                          d="M3.55866 8.99785H7.12491V20.4504H3.55866V8.99785ZM5.33916 3.29785C6.47691 3.29785 7.40166 4.2226 7.40166 5.36035C7.40166 6.4981 6.47691 7.4251 5.33991 7.4251C4.7926 7.42391 4.26804 7.20602 3.88096 6.81908C3.49388 6.43215 3.2758 5.90766 3.27441 5.36035C3.27441 5.08931 3.32784 4.82093 3.43163 4.57055C3.53542 4.32017 3.68754 4.0927 3.8793 3.90115C4.07106 3.7096 4.29869 3.55772 4.54919 3.45421C4.79968 3.35069 5.06812 3.29756 5.33916 3.29785ZM9.35166 8.99785H12.7657V10.5631H12.8129C13.2884 9.6631 14.4494 8.7136 16.1879 8.7136C19.7924 8.7136 20.4577 11.0859 20.4577 14.1691V20.4511H16.9004V14.8801C16.9004 13.5526 16.8764 11.8426 15.0509 11.8426C13.1984 11.8426 12.9134 13.2901 12.9134 14.7826V20.4481H9.35691V8.9956L9.35166 8.99785Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_701_25203">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  {/* End of Linkedin SVG image */}
                  <div className="k-font-size-lg k-font-weight-bold">
                    @your.account
                  </div>
                </div>
                <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
                  <div>112k followers</div>
                  <div>3.5m likes</div>
                  <div>20m views</div>
                </div>
              </div>
              {/* End of CMPCTCARD-L-7 */}

             <ToDoListCard/>
             
              <BrowserUsageCard/>

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
