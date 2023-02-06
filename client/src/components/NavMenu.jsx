import React from 'react';

import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Link } from "react-router-dom";

class NavMenu extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      DataisLoaded: false,
      productFields: [],
      cartItems: [],
      productContext: {
          sku: null,
          effectiveAccountId: null,
      },
  };

  }  

  render() {
    const { value } = this.context;
    const {
      logo,
      cartItems
    } = this.props;
    
    return (
    <nav>
        <ul>
            <li>
                <Link to={process.env.PUBLIC_URL + "/"}>
                Home
                </Link>
            </li>
            <li>
                <Link to={process.env.PUBLIC_URL + "/product"}>
                Products
                <i className="fa fa-angle-down" />
                </Link>
            </li>
        </ul>
    </nav>
    )
  };
}

NavMenu.contextType = AppContext;

NavMenu.propTypes = {
  id: PropTypes.string.isRequired,
};

export default NavMenu;
