import React from 'react';

import { PageContainer, Header, MainContent } from './components';

function App() {
  console.log(window.ipcRenderer);

  return (
    <PageContainer>
      <Header />
      <MainContent />
    </PageContainer>
  );
}

export default App;
