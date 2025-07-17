"use client";

import { useState } from "react";
import { DatePicker, DateInput } from "@progress/kendo-react-dateinputs";
import { SvgIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { ListView } from "@progress/kendo-react-listview";
import { xIcon, arrowUpIcon, arrowDownIcon } from "@progress/kendo-svg-icons";
import { browsers } from "../data";
import { listViewSvgIcons } from "../svg-icons";
import React from "react";

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
        <span className="k-font-size-sm k-color-subtle">{props.dataItem.value}</span>
      </div>
    </div>
  );
};

const BrowserUsageCard = () => {
  const [date, setDate] = useState(new Date("6/12/2023"));

  const handleDateChange = (e) => {
    setDate(e.value);
  };

  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-5 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: "392px" }}
    >
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Browser Usage
        </span>
        <div style={{ width: "164px" }}>
          <DatePicker
            value={date}
            onChange={handleDateChange}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput
                  ariaLabel="Browser Usage date picker"
                  value={date}
                />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-flex-1 k-overflow-auto">
        <ListView
          data={browsers}
          item={BrowserUsageItemRender}
          className="k-flex-1"
        />
      </div>
      <div className="k-d-flex k-flex-row k-p-4">
        <Button fillMode="clear" themeColor="primary">
          View all browsers
        </Button>
      </div>
    </div>
  );
};

export default BrowserUsageCard;