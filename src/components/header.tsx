import React from 'react';

import logo from '../../public/logo.png';

function Header() {
  return (
    <div className="logo">
      <img src={logo} alt="biotopia-logo" />
      <h2>Receipts Browser</h2>
    </div>
  );
}

export default Header;
