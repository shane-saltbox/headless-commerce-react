import React from 'react';

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { MenuCart, NavMenu } from "../components";

import AppContext from '../AppContext';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      languages: [],
    };

    /*
     * EVENT HANDLERS
     */

    this.handleClick = e => {
      e.currentTarget.nextSibling.classList.toggle("active");
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidUpdate(prevProps) {
    
  }

  render() {
    const { value } = this.context;
    const {
      logo,
      cartItems
    } = this.props;


    return (
      <header>
        <div className="container">
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              {/* header logo */}
              <a aria-label="Home" rel="noopener noreferrer" role="button" target="_blank">
                {logo ? <img className="header-logo" src="https://headless-commerce.herokuapp.com/images/tinyHomesLogo.png" alt="" /> : <Skeleton height={52} width={75} />}
              </a>
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              {/* Nav menu */}
              <NavMenu />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              {/* Cart Icon */}
              <div className="dropdown  header-locale">
                <span className="count-style">
                  {cartItems ? (
                    <>
                      <button className="icon-cart" onClick={e => this.handleClick(e)}>
                        <i className="pe-7s-shopbag" />
                        <span className="count-style">
                          {cartItems && cartItems.length ? cartItems.length : 0}
                        </span>
                      </button>
                      {/* menu cart */}
                      <MenuCart cartItems={cartItems} />
                    </>
                  ) : <Skeleton height={45} width={75} />}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.contextType = AppContext;

Header.defaultProps = {
  logo: '/tinyHomesLogo.png',
};

Header.propTypes = {
  logo: PropTypes.string.isRequired,
  cartItems: PropTypes.string.isRequired,
};

export default Header;
