import React from 'react';

import styles from './styles.module.css';

type UserDetailsProps = {
  img: string;
  name: string;
};

function UserDetails({ img, name }: UserDetailsProps) {
  return (
    <div className={styles.container}>
      <img src={img} alt="User Image" className={styles.displayPhoto} />
      <span className={styles.displayName}>{name}</span>
      <span>🇵🇭</span>
    </div>
  );
}

export default UserDetails;
