import React from 'react';

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import MenuCart from "../components/MenuCart";

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

    /* this.handleClick = (event, language) => {
      const { setValue, value } = this.context;

      event.preventDefault();


      setValue(
        { ...value.globalAlert },
        { businessUnit: language.bu, language: language.lang },
        value.roadblocked,
        { ...value.settings },
        { ...value.strings },
        { ...value.theme },
        value.wsStatus,
      );
    }; */
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidUpdate(prevProps) {
    
  }

  handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  render() {
    const { value } = this.context;
    const {
      logo,
      cartItems
    } = this.props;


    return (
      <header>
        <div className="container">
          <a aria-label="Home" rel="noopener noreferrer" role="button" target="_blank">
            {logo ? <img className="header-logo" src="https://headless-commerce.herokuapp.com/images/tinyHomesLogo.png" alt="" /> : <Skeleton height={52} width={75} />}
          </a>
          <div className="dropdown  header-locale">
            <span className="count-style">
              {cartItems ? (
                <>
                  <i className="pe-7s-shopbag" />
                  <button className="icon-cart" onClick={e => handleClick(e)}>
                    <i className="pe-7s-shopbag" />
                    <span className="count-style">
                      {cartItems && cartItems.length ? cartItems.length : 0}
                    </span>
                  </button>
                  {/* menu cart */}
                  
                </>
              ) : <Skeleton height={45} width={75} />}
            </span>
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
