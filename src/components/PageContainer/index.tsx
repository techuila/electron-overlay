import React, { ReactNode, useEffect, useState } from 'react';
import cx from 'classnames';

import Settings from '../../../libs/Settings';

import styles from './styles.module.css';

const settings = Settings.getInstance();

function PageContainer({ children }: { children?: ReactNode }) {
  const [isOverlay, setIsOverlay] = useState(settings.isOverlay);

  useEffect(() => {
    const updateOverlay = (event: Electron.IpcRendererEvent, overlayState: boolean) => {
      setIsOverlay(overlayState);
      settings.updateOverlayFromMain(overlayState); // Update overlay state in the Settings class
    };

    window.ipcRenderer.on('overlay-state', updateOverlay);

    return () => {
      window.ipcRenderer.removeListener('overlay-state', updateOverlay);
    };
  }, []);

  return (
    <div id="main-container" className={cx(styles.container, { [styles.overlay]: isOverlay })}>
      {children}
    </div>
  );
}

export default PageContainer;
