"use client";

import { useState } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { DatePicker, DateInput } from "@progress/kendo-react-dateinputs";
import { SvgIcon } from "@progress/kendo-react-common";
import { xIcon } from "../svg-icons";
import { followers } from "../data";

const FollowersCard = () => {
  const [date, setDate] = useState(new Date("6/14/2023"));

  const handleDateChange = (e) => {
    setDate(e.value);
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Followers
        </span>
        <div style={{ width: "164px" }}>
          <DatePicker
            value={date}
            onChange={handleDateChange}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Followers date picker" value={date} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1 k-justify-content-center">
        <Chart style={{ height: "293px" }}>
          <ChartSeries>
            <ChartSeriesItem
              type="pie"
              legendItem={{ type: "line" }}
              data={followers}
              categoryField="platform"
              field="share"
              padding={10}
              border={{ width: 3, color: "#fff" }}
            >
              <ChartSeriesLabels position="center" />
            </ChartSeriesItem>
          </ChartSeries>
          <ChartLegend
            position="bottom"
            align="center"
            padding={{ left: 60, right: 60 }}
          />
        </Chart>
      </div>
    </div>
  );
};

export default FollowersCard;