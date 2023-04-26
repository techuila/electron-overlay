import React, { ReactNode } from 'react';

import LogoutIcon from '../../assets/icons/logout.svg';

import styles from './styles.module.css';

interface ReactNodeProps {
  children: ReactNode;
}

function Badge({ children }: ReactNodeProps) {
  return <div className={styles.badge}>{children}</div>;
}

function NavLink({ children }: ReactNodeProps) {
  return <h1 className={styles.navLink}>{children}</h1>;
}

function Navigation() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Go to</h3>

      <NavLink>
        Challenges<Badge>3</Badge>
      </NavLink>
      <NavLink>
        Referrals<Badge>Soon</Badge>
      </NavLink>

      <a href="#" className={styles.logout}>
        Logout <img src={LogoutIcon} alt="Logout Icon" />
      </a>
    </div>
  );
}

export default Navigation;
