import React, { PropsWithChildren, ReactChild, ReactNode } from 'react';

import LogoutIcon from '../../assets/icons/logout.svg';

import styles from './styles.module.css';

interface NavLinkProps {
  onClick?: () => void;
}

function Badge({ children }: PropsWithChildren<NavLinkProps>) {
  return <div className={styles.badge}>{children}</div>;
}

function NavLink({ onClick, children }: PropsWithChildren<NavLinkProps>) {
  return (
    <h1 className={styles.navLink} onClick={onClick}>
      {children}
    </h1>
  );
}

function Navigation() {
  const onclick = () => {
    alert('Link clicked!');
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Go to</h3>

      <NavLink onClick={onclick}>
        Challenges<Badge>3</Badge>
      </NavLink>
      <NavLink onClick={onclick}>
        Referrals<Badge>Soon</Badge>
      </NavLink>

      <a href="#" className={styles.logout}>
        Logout <img src={LogoutIcon} alt="Logout Icon" />
      </a>
    </div>
  );
}

export default Navigation;
