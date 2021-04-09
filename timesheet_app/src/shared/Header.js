import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/graphics/logo.svg';

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="container">
          <div className="header-wrapper">
            <Link className="header-brand" to="/">
              <div className="header-brand-logo">
                <img src={logo} alt="ChronoBit logo"/>
              </div>
              <span>ChronoBit</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;