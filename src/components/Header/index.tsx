import React from 'react';

import { Button, InfoCard, UserDetails } from '..';
import { Themes } from '../Button';

import BellIcon from '../../assets/icons/notifications.svg';
import TrialsCreditIcon from '../../assets/icons/trials-credit.svg';
import PeopleAltIcon from '../../assets/icons/people-alt.svg';
import AchievementIcon from '../../assets/icons/achievement.svg';
import TrophyIcon from '../../assets/icons/trophy.svg';
import RankIcon from '../../assets/icons/rank.svg';
import TrialsIcon from '../../assets/img/trials-logo.png';
import UserImg from '../../assets/img/rickroll-roll.gif';

import styles from './styles.module.css';

function Header() {
  return (
    <div className={styles.container} data-interactive-overlay>
      <div className={styles.left}>
        <img src={TrialsIcon} alt="Trials Logo" className={styles.logo} />
        <UserDetails img={UserImg} name="Rick Roll" />

        <InfoCard icon={RankIcon} title="Current Challenger Rank" info="Gold V" />
        <InfoCard icon={TrophyIcon} title="Completed Challenges" info="143" />
        <InfoCard icon={AchievementIcon} title="Created Challenges" info="44" />
      </div>
      <div className={styles.right}>
        <InfoCard icon={TrialsCreditIcon} title="Trials Credits" info="1001" />
        <Button label="Refer a friend" theme={Themes.GHOST} icon={PeopleAltIcon} className={styles.referAFriend} />
        <div className={styles.notificationContainer}>
          <img src={BellIcon} alt="Notification Icon" className={styles.notification} />
        </div>
      </div>
    </div>
  );
}

export default Header;
