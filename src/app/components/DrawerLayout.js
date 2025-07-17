"use client";

import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import CustomDrawerItem from "./CustomDrawerItem";

const DrawerLayout = ({ children, drawerItems }) => {
  return (
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
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerLayout;