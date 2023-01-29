import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Badge } from '../components';
import { WS_STATUS } from '../Constants';

import 'bootstrap/dist/js/bootstrap.bundle';

let nextId = 0;

class AddToCart extends React.Component {
    constructor(props) {
    super(props);

    this.state = {
        cart: null,
        cartItems: [],
    };

    /*
     * EVENT HANDLERS
     */

    handleClick = (event) => {
        e.preventDefault();
        console.log('handleClick: '+event);
        const { productSku, productAmount } = event.target;
  
        this.setState({ cart: productSku })
      };

  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidUpdate(prevProps) {

  }


  render() {
    const { value: contextValue } = this.context;
    const {
      productSku,
      productAmount,
    } = this.props;

    return (
      <div className="">
            <button onClick={() => {
                cartItems([
                ...cart,
                { id: nextId++, name: {productSku} }
                ]);
            }}>Add</button>
      </div>
    );
  }
}

AddToCart.contextType = AppContext;


AddToCart.propTypes = {
  productSku: PropTypes.string.isRequired,
  productAmount: PropTypes.string.isRequired,
};

export default AddToCart;
