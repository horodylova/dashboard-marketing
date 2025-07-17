"use client";

import {
  AppBar,
  AppBarSection,
} from '@progress/kendo-react-layout';
import { SvgIcon } from '@progress/kendo-react-common';
import {
  InputPrefix,
  TextBox,
} from '@progress/kendo-react-inputs';
import {
  bellIcon,
  envelopIcon,
  menuIcon,
  searchIcon,
  userIcon,
} from '@progress/kendo-svg-icons';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import { DropDownButton, Button } from '@progress/kendo-react-buttons';
import Logo from '../../../public/logo.svg';
import CompactLogo from '../../../public/logo-compact.svg';

const Header = () => {
  return (
    <header className="k-d-contents">
      <AppBar positionMode="sticky" themeColor="primary">
        <AppBarSection className="k-flex-basis-0 k-flex-grow k-gap-2">
          <Button title="Menu" svgIcon={menuIcon} fillMode="clear" themeColor="light" />
          <a href="#" className="k-d-none k-d-md-flex">
            <Logo width={120} height={30} />
          </a>
          <a href="#" className="k-d-flex k-d-md-none">
            <CompactLogo width={30} height={30} />
          </a>
        </AppBarSection>
        <AppBarSection className="k-flex-basis-0 k-flex-grow k-justify-content-center">
          <TextBox
            className="k-d-xs-none k-d-md-flex"
            style={{ width: '360px' }}
            placeholder="Input value"
            name="input-value"
            prefix={() => (
              <>
                <InputPrefix>
                  <SvgIcon icon={searchIcon} />
                </InputPrefix>
              </>
            )}
          />
        </AppBarSection>
        <AppBarSection className="k-flex-basis-0 k-flex-grow k-justify-content-end k-gap-1.5">
          <Button
            className="k-d-md-none"
            svgIcon={searchIcon}
            fillMode="clear"
            themeColor="light"
          />
          <BadgeContainer>
            <Button title="Notifications" svgIcon={bellIcon} fillMode="flat" />
            <Badge
              rounded="medium"
              position="inside"
              align={{ vertical: 'top', horizontal: 'end' }}
              themeColor="error"
            />
          </BadgeContainer>

          <BadgeContainer>
            <Button title="Emails" svgIcon={envelopIcon} fillMode="flat" />
            <Badge
              rounded="medium"
              position="inside"
              align={{ vertical: 'top', horizontal: 'end' }}
              themeColor="error"
            />
          </BadgeContainer>
          <span className="k-appbar-separator k-color-border" />
          <DropDownButton
            svgIcon={userIcon}
            text="Hi admin"
            themeColor="light"
            fillMode="clear"
          />
        </AppBarSection>
      </AppBar>
    </header>
  );
};

export default Header;