import React from 'react';

import styles from './styles.module.css';

type InfoCardProps = {
  icon: string;
  title: string;
  info: string;
};

function InfoCard({ icon, title, info }: InfoCardProps) {
  return (
    <div className={styles.container}>
      <img src={icon} alt="Icon" className={styles.icon} />

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>{info}</div>
      </div>
    </div>
  );
}

export default InfoCard;
