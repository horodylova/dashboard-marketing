"use client";

import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon, checkIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { Chip } from '@progress/kendo-react-buttons';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend } from '@progress/kendo-react-charts';
import { postReachData } from '../data';

const PostReachCard = () => {
  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-12 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Post Reach
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={new Date('6/12/2023')}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Post Reach date picker" value={new Date('6 / 12 / 2023')} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-d-flex k-gap-2 k-px-4 k-pb-4">
        <Chip
          text="Instagram"
          themeColor="base"
          rounded="full"
          size="small"
        ></Chip>
        <Chip
          text="Facebook"
          themeColor="base"
          rounded="full"
          size="small"
          svgIcon={checkIcon}
        ></Chip>
        <Chip
          text="YouTube"
          themeColor="base"
          rounded="full"
          size="small"
        ></Chip>
        <Chip
          text="TikTok"
          themeColor="base"
          rounded="full"
          size="small"
        ></Chip>
        <Chip
          text="Twitter"
          themeColor="base"
          rounded="full"
          size="small"
        ></Chip>
        <Chip
          text="LinkedIn"
          themeColor="base"
          rounded="full"
          size="small"
        ></Chip>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1">
        {/* Line Chart with two series & height 362px */}
        <Chart style={{ height: '362px' }}>
          <ChartSeries>
            <ChartSeriesItem
              type="line"
              data={postReachData}
              field="Viewers[0].number"
              categoryField="Date"
              name="Organic"
            />
            <ChartSeriesItem
              type="line"
              data={postReachData}
              field="Viewers[1].number"
              categoryField="Date"
              name="Paid"
            />
          </ChartSeries>
          <ChartCategoryAxis>
            <ChartCategoryAxisItem
              baseUnit="hours"
              labels={{
                rotation: 270,
                position: 'start',
                format: 'haa',
              }}
            />
          </ChartCategoryAxis>
          <ChartValueAxis>
            <ChartValueAxisItem
              labels={{ format: '{0}k' }}
              min={0}
              max={500}
            />
          </ChartValueAxis>
          <ChartLegend position="bottom" orientation="horizontal" />
        </Chart>
        {/* End of Line Chart */}
      </div>
    </div>
  );
};

export default PostReachCard;