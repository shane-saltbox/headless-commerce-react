import React from 'react';

import AppContext from '../AppContext';

const Roadblock = () => {
  const context = React.useContext(AppContext);
  const { value } = context;

  return (
    <main className="full-height">
      <div className="container pt-5">
        <div className="alert alert-light alert-roadblock" role="alert">
          {value.strings.roadblock}
          <svg className="bi bi-alert-octagon" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'blur(4px)' }}>
            <path fillRule="evenodd" d="M6.54 2.146A.5.5 0 016.893 2h6.214a.5.5 0 01.353.146l4.394 4.394a.5.5 0 01.146.353v6.214a.5.5 0 01-.146.353l-4.394 4.394a.5.5 0 01-.353.146H6.893a.5.5 0 01-.353-.146L2.146 13.46A.5.5 0 012 13.107V6.893a.5.5 0 01.146-.353L6.54 2.146zM7.1 3L3 7.1v5.8L7.1 17h5.8l4.1-4.1V7.1L12.9 3H7.1z" clipRule="evenodd" />
            <rect width="2" height="2" x="9.002" y="12" rx="1" />
            <path d="M9.1 6.995a.905.905 0 111.8 0l-.35 3.507a.553.553 0 01-1.1 0L9.1 6.995z" />
          </svg>
        </div>
      </div>
    </main>
  );
};

export default Roadblock;
