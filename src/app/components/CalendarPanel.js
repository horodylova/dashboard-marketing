"use client";

import { MultiViewCalendar } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';

const CalendarPanel = () => {
  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-3 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: '392px' }}
    >
      <div className="k-d-flex k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Calendar
        </span>
      </div>
      <div className="k-px-4 k-d-flex k-justify-content-center k-flex-1">
        <MultiViewCalendar views={1} value={new Date(2023, 0, 21)} />
      </div>
      <div className="k-p-4">
        <Button fillMode="clear" themeColor="primary">
          View schedule
        </Button>
      </div>
    </div>
  );
};

export default CalendarPanel;