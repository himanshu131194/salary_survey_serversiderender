import React, { Component } from 'react';
import teamlease from '../images/TeamLease-white.png';
//import user from '../images/user_white.png';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <div className="header-section">
          <div className="center-align">
            <div className="main-logo inline-block">
              <a href="http://dev.teamleasejobs.com">
                <img title="Teamlease -No.1 website" alt="Teamlease logo - No.1 website" src={teamlease} />
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
