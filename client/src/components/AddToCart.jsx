import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Badge } from '../components';
import { WS_STATUS } from '../Constants';

import 'bootstrap/dist/js/bootstrap.bundle';

class AddToCart extends React.Component {
  constructor(props) {
    super(props);

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
        <form>
            <button type="button" className='btn btn-large' productSku={productSku} productAmount={productAmount} onClick={this.handleClick} >Add To Cart</button>
        </form>
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
