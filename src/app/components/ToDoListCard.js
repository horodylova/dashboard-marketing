"use client";

import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon, pencilIcon, trashIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { ListView } from '@progress/kendo-react-listview';
import { Checkbox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { listViewData } from '../data';

const ToDoListItemRender = (props) => {
  return (
    <div role="listitem" className="k-d-flex k-justify-content-between k-px-2 k-py-1">
      <div className="k-d-flex k-align-items-center">
        <label className="k-checkbox-label">
          <Checkbox checked={props.dataItem.checked} />
          {props.dataItem.text}
        </label>
      </div>
      <div className="k-white-space-nowrap">
        <Button title="Edit To Do" svgIcon={pencilIcon} fillMode="flat" size="small" />
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

const ToDoListCard = () => {
  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: '392px' }}
    >
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          To Do List
        </span>
        <div style={{ width: '142px' }}>
          <DatePicker
            value={new Date('6/12/2023')}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="To Do List date picker" value={new Date('6 / 12 / 2023')} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-pb-4 k-flex-1 k-overflow-y-auto">
        <ListView
          className="k-w-full k-height-auto k-overflow-y-auto k-gap-1"
          data={listViewData}
          item={ToDoListItemRender}
        />
      </div>
    </div>
  );
};

export default ToDoListCard;