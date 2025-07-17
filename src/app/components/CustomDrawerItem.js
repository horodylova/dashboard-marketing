"use client";

import Image from "next/image";
import { DrawerItem } from '@progress/kendo-react-layout';
import { SvgIcon } from '@progress/kendo-react-common';
import { chevronDownIcon } from '@progress/kendo-svg-icons';
import { drawerImages } from '../data';

const CustomDrawerItem = (props) => {
  if (!props.separator) {
    return (
      <DrawerItem selected={props.selected}>
        <Image
          src={props.text !== 'Help' ? drawerImages[props.id] : drawerImages[7]}
          alt="Emoji"
          className="k-w-4 k-h-4"
          width={16}
          height={16}
        />
        <span className="k-item-text">{props.text}</span>
        {props.expandable && <span className="k-spacer" />}
        {props.expandable && (
          <span className="k-drawer-toggle">
            <SvgIcon icon={chevronDownIcon} />
          </span>
        )}
      </DrawerItem>
    );
  } else {
    return <DrawerItem separator={props.separator} />;
  }
};

export default CustomDrawerItem;