"use client";

import {
  AppBar,
  AppBarSection,
} from '@progress/kendo-react-layout';


import {

  menuIcon,
  searchIcon,
  userIcon,
  xIcon,
} from '@progress/kendo-svg-icons';

import { DropDownButton, Button } from '@progress/kendo-react-buttons';
import Logo from '../../../public/logo.svg';
import CompactLogo from '../../../public/logo-compact.svg';

import CompanyDrawerSection from './CompanyDrawerSection';

const Header = ({ onMobileMenuToggle, isMobileMenuOpen, isMobile }) => {
  return (
    <>
      <header className="k-d-contents">
        <AppBar positionMode="sticky" themeColor="primary">
          <AppBarSection className="k-flex-basis-0 k-flex-grow k-gap-2">
            {isMobile && (
              <Button
                title="Menu"
                svgIcon={isMobileMenuOpen ? xIcon : menuIcon}
                fillMode="clear"
                themeColor="light"
                onClick={onMobileMenuToggle}
              />
            )}
            <a href="#" className="k-d-none k-d-md-flex">
              <Logo width={120} height={30} />
            </a>
            <a href="#" className="k-d-flex k-d-md-none">
              <CompactLogo width={30} height={30} />
            </a>
          </AppBarSection>
                     
          <AppBarSection className="k-flex-basis-0 k-flex-grow k-justify-content-end k-gap-1.5">
            
                        
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

      {isMobile && isMobileMenuOpen && (
        <>
       
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={onMobileMenuToggle}
          />
          
       
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              height: '100vh',
              backgroundColor: 'white',
              zIndex: 1000,
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
              transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s ease-in-out',
              overflow: 'hidden',
            }}
          >
          
            <div
              style={{
                backgroundColor: 'var(--kendo-color-primary)',
                color: 'white',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '46px',
              }}
            >
              <CompactLogo width={30} height={30} />
              <Button
                svgIcon={xIcon}
                fillMode="clear"
                themeColor="light"
                onClick={onMobileMenuToggle}
              />
            </div>
            
            <div style={{ height: 'calc(100vh - 78px)', overflow: 'auto' }}>
              <CompanyDrawerSection 
                isMobile={true} 
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuToggle={onMobileMenuToggle}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;