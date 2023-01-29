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
        cartItems: [],
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
    const { value: contextValue } = this.context;
    const {
      productSku,
      productAmount,
    } = this.props;

    return (
      <div>
            <input
                type="text"
                onChange={this.saveInput}
            />
            <button className="btn btn-primary" onClick={this.addNewItem}> Add Item </button>
            <ol>
                {this.state.cartItems.map((subItems, sIndex) => {
                    return <li key={sIndex}> {subItems}</li>
                })}
            </ol>
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
