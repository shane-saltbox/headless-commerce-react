import React from 'react';

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

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

    this.handleClick = (event, language) => {
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
      cart
    } = this.props;


    return (
      <header>
        <div className="container">
          <a aria-label="Home" rel="noopener noreferrer" role="button" target="_blank">
            {logo ? <img className="header-logo" src={logo} alt="" /> : <Skeleton height={52} width={75} />}
          </a>
          <div className="dropdown  header-locale">
            {cart ? (
              <>
                <p>Cart</p>
              </>
            ) : <Skeleton height={45} width={75} />}
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
  cart: PropTypes.string.isRequired,
};

export default Header;
