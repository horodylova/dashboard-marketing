"use client";

import { useState } from "react";
import { DatePicker, DateInput } from "@progress/kendo-react-dateinputs";
import { SvgIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import { xIcon, pencilIcon, trashIcon } from "@progress/kendo-svg-icons";
import { gridData } from "../data";
import { gridSvgIcons } from "../svg-icons";
import React from "react";

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
      <Button title="Edit Scheduled Post" svgIcon={pencilIcon} fillMode="flat" size="small" />
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

const ScheduledPostsCard = () => {
  const [date, setDate] = useState(new Date("6/14/2023"));

  const handleDateChange = (e) => {
    setDate(e.value);
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-8 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-px-4 k-py-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Scheduled Posts
        </span>
        <div style={{ width: "164px" }}>
          <DatePicker
            value={date}
            onChange={handleDateChange}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Scheduled Posts date picker" value={date} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-flex-1 k-overflow-auto">
        <Grid data={gridData} className="k-grid-no-scrollbar">
          <GridColumn field="time" title="Time" width="96px" />
          <GridColumn field="postTitle" title="Post Title" />
          <GridColumn
            title="Platform"
            width="96px"
            cells={{
              data: PlatformCell,
            }}
          />
          <GridColumn
            field="status"
            title="Status"
            cells={{
              data: StatusCell,
            }}
            width="96px"
          />
          <GridColumn
            title="Action"
            cells={{
              data: ActionCell,
            }}
            width="96px"
          />
        </Grid>
      </div>
      <div className="k-d-flex k-flex-row k-px-4 k-py-3">
        <Button fillMode="clear" themeColor="primary">
          View all posts
        </Button>
      </div>
    </div>
  );
};

export default ScheduledPostsCard;