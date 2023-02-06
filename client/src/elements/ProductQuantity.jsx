import React from 'react';

import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Link } from "react-router-dom";
import { addToCart } from "../slices/cart-slice"

class MenuCart extends React.Component {
  
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
      cartItems,
      productContext
    } = this.props;
    
    return (
        <div className="cart-plus-minus">
            <button
            onClick={() =>
                setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
            }
            className="dec qtybutton"
            >
            -
            </button>
            <input
            className="cart-plus-minus-box"
            type="text"
            value={quantityCount}
            readOnly
            />
            <button
            onClick={() =>
                setQuantityCount(
                quantityCount < productStock - productCartQty
                    ? quantityCount + 1
                    : quantityCount
                )
            }
            className="inc qtybutton"
            >
            +
            </button>
      </div>
    )
  };
}

MenuCart.contextType = AppContext;

MenuCart.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MenuCart;
