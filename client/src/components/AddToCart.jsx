import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Badge } from '../components';
import { WS_STATUS } from '../Constants';
import Skeleton from 'react-loading-skeleton';
import MyCartService from '../services/cart-service';

import 'bootstrap/dist/js/bootstrap.bundle';

class AddToCart extends React.Component {
    constructor(props) {
    super(props);

    this.state = {
        cartItems: [],
        quantityCount: 1,
    };

    this.wsEndpoint = new MyCartService('0a65e000000M3cEAAS', '01t5e000002XjT3AAK', '1');

    this.onAddToCart = (quantity) => {
        this.wsEndpoint.postCart('0a65e000000M3cEAAS', '01t5e000002XjT3AAK', quantity).then((response) => {
  
          if (response.success) {
            console.log('add to cart success: '+response);
            /* this.setState({ fieldGroups: newFieldGroups }); */
          } else {
            console.log('failed add to cart')
          }
        });
      };

  }

    /*
     * EVENT HANDLERS
     */
    saveInput = (e) => {
        this.setState({ input: e.target.value });
    };

    addNewItem = () => {
        let { cartItems, input } = this.state;
        cartItems.push(input);
        console.log('##DEBUG cartItems: '+cartItems);
        // this.state.cart.push(this.state.input); // same as above, though bad practice 
    };

  /*
   * LIFECYCLE METHODS
   */

  componentDidUpdate(prevProps) {
    
  }


  render() {
    const { value } = this.context;
    const {
        productSku,
        productAmount,
        cartItems,
        productContext,
        quantityCount
    } = this.props;

    return (
        <>
            {cartItems && cartItems.length > 0 ? (
                <>
                    {cartItems.filter(e => e.cartItem.productDetails.sku === productSku).map((item) => {
                        return (
                            <div className='row'>
                                <div className='col-lg-2'>
                                    <div className="cart-plus-minus">
                                        <button
                                        onClick={() => this.setState({ quantityCount: this.state.quantityCount > 1 ? this.state.quantityCount - 1 : 1 })}
                                        className="dec qtybutton"
                                        >
                                        -
                                        </button>
                                        <input
                                        className="cart-plus-minus-box"
                                        type="text"
                                        value={this.state.quantityCount}
                                        readOnly
                                        />
                                        <button
                                        onClick={() => this.setState({ quantityCount: this.state.quantityCount > 1 ? this.state.quantityCount + 1 : 1 })}
                                        className="inc qtybutton"
                                        >
                                        +
                                        </button>
                                    </div>
                                </div>
                                <div className='col-lg-2'>
                                    <button 
                                        className="btn btn-lg btn-primary add-to-cart" 
                                        onClick={this.onAddToCart(this.state.quantityCount)}
                                    > Add Item </button>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                <Skeleton height={45} />
            )}
        </>
    )
  }
}

AddToCart.contextType = AppContext;


AddToCart.propTypes = {
  productSku: PropTypes.string.isRequired,
  productAmount: PropTypes.string.isRequired,
  /* cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      sku: PropTypes.string.isRequired,
      quantity: PropTypes.string,
    }), */
};

export default AddToCart;
