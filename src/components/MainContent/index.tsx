import React from 'react';

import BountyCard from '../BountyCard';

import Navigation from '../Navigation';

import RazerImg from '../../assets/img/razer.png';
import AsusImg from '../../assets/img/asus.png';

import styles from './styles.module.css';

function MainContent() {
  return (
    <div className={styles.container}>
      <div className={styles.bountyList}>
        <BountyCard title="Razer Daily Challenges" info="A Bounty!" backgroundImg={RazerImg} />
        <BountyCard title="Asus ROG Weekly Trials" info="A Bounty!" backgroundImg={AsusImg} />
      </div>

      <Navigation />
    </div>
  );
}

export default MainContent;
