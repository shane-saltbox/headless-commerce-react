import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Badge } from '../components';
import { WS_STATUS } from '../Constants';
import { addToCart } from "../slices/cart-slice";

import 'bootstrap/dist/js/bootstrap.bundle';

let nextId = 0;

class AddToCart extends React.Component {
    constructor(props) {
    super(props);

    this.state = {
        cartItems: [],
        quantityCount,
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

    // filter cartItems to the one that matches the sku
    var items = cartItems.cartItems;
    var product = items.find(e => e.cartItem.productId === productSku);
    console.log('product: '+product);

    return (
        <>
            {/* <input
                className="form-control"
                type="text"
                onChange={this.saveInput}
                placeholder="Quantity"
                style={{height:52}}
            /> */}
            {product && product.length > 0 ? (
                <>
                    {product.map((item) => {
                        <div className='row'>
                            <div className='col-lg-3'>
                                <div className="cart-plus-minus">
                                    <button
                                    onClick={() => this.setState({ quantityCount: quantityCount > 1 ? quantityCount - 1 : 1 })}
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
                                    onClick={() => this.setState({ quantityCount: quantityCount > 1 ? quantityCount + 1 : 1 })}
                                    className="inc qtybutton"
                                    >
                                    +
                                    </button>
                                </div>
                            </div>
                            <div className='col-lg-1'>
                                <button 
                                    className="btn btn-lg btn-primary add-to-cart" 
                                    /* onClick={this.addNewItem} */
                                    
                                > Add Item </button>
                            </div>
                        </div>
                    })}
                </>
            ) : (
                <p className="text-center">No items added to cart</p>
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
