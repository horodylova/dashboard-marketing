"use client";

import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend } from '@progress/kendo-react-charts';
import { followersGrowth } from '../data';

const FollowersGrowthCard = () => {
  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Followers Growth
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={new Date('6/12/2023')}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Followers Growth date picker" value={new Date('6 / 12 / 2023')} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1">
        {/* Bar Chart with 6 series & default height */}
        <Chart>
          <ChartCategoryAxis>
            <ChartCategoryAxisItem
              categories={['2023', '2022', '2021', '2020']}
            />
          </ChartCategoryAxis>
          <ChartValueAxis>
            <ChartValueAxisItem
              labels={{ format: '{0}k' }}
              majorGridLines={{ visible: false }}
              min={0}
              max={900}
              majorUnit={100}
            />
          </ChartValueAxis>
          <ChartSeries>
            {followersGrowth.map((f) => {
              return (
                <ChartSeriesItem
                  key={f.name}
                  type="bar"
                  data={f.data}
                  name={f.name}
                  legendItem={{ type: 'line' }}
                />
              );
            })}
          </ChartSeries>
          <ChartLegend position="bottom" orientation="horizontal" />
        </Chart>
        {/* End of Bar Chart */}
      </div>
    </div>
  );
};

export default FollowersGrowthCard;