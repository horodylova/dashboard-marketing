"use client";

import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend } from '@progress/kendo-react-charts';
import { clickRateData } from '../data';

const ClickThroughRateCard = () => {
  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Average click-through rate
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={new Date('6/12/2023')}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Average click-through rate date picker" value={new Date('6 / 12 / 2023')} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-d-flex k-flex-col k-px-4 k-pb-4 k-flex-1 k-gap-2">
        {/* Column Chart with 6 series & default height */}
        <Chart>
          <ChartCategoryAxis>
            <ChartCategoryAxisItem
              categories={[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ]}
            />
          </ChartCategoryAxis>
          <ChartValueAxis>
            <ChartValueAxisItem
              min={0}
              max={100}
              labels={{ format: '{0}%' }}
              majorUnit={10}
            />
          </ChartValueAxis>
          <ChartSeries>
            {clickRateData.map((c) => {
              return (
                <ChartSeriesItem
                  key={c.name}
                  type="column"
                  legendItem={{ type: 'line' }}
                  data={c.data}
                  name={c.name}
                />
              );
            })}
          </ChartSeries>
          <ChartLegend position="bottom" orientation="horizontal" />
        </Chart>
        {/* End of Column Chart */}
      </div>
    </div>
  );
};

export default ClickThroughRateCard;