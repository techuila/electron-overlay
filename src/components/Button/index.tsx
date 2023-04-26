import React from 'react';
import cx from 'classnames';

import styles from './styles.module.css';

export enum Themes {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  GHOST = 'ghost'
}

type ButtonProps = {
  theme?: Themes;
  icon?: string;
  rounded?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;

  label: string;
};

function Button({ theme, rounded, label, fullWidth, icon, className, onClick = () => {} }: ButtonProps) {
  const classes = {
    primary: { [styles.primary]: theme === Themes.PRIMARY || theme === undefined },
    secondary: { [styles.secondary]: theme === Themes.SECONDARY },
    ghost: { [styles.ghost]: theme === Themes.GHOST },
    rounded: { [styles.rounded]: rounded },
    fullWidth: { [styles.fullWidth]: fullWidth },
    gapBetween: { [styles.gapBetween]: icon }
  };

  return (
    <div
      className={cx(
        styles.baseStyle,
        classes.primary,
        classes.secondary,
        classes.ghost,
        classes.rounded,
        classes.fullWidth,
        classes.gapBetween,
        className
      )}
      onClick={onClick}
      data-interactive-overlay
    >
      {label}
      {icon && <img alt="Icon" src={icon} />}
    </div>
  );
}

export default Button;
