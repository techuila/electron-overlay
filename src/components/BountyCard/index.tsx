import React from 'react';

import styles from './styles.module.css';

type BountyCardProps = {
  info: string;
  title: string;
  backgroundImg: string;
};

function BountyCard({ info, title, backgroundImg }: BountyCardProps) {
  function onClick() {
    window.ipcRenderer.send('start');
  }
  return (
    <div className={styles.container} onClick={onClick} data-interactive-overlay>
      <div className={styles.content}>
        <span className={styles.info}>{info}</span>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <img src={backgroundImg} alt="Background Image" className={styles.background} />
    </div>
  );
}

export default BountyCard;
