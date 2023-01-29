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

    this.handleClick = (event) => {
        const {
          availableSubId,
          callback,
          disabled,
          label,
        } = this.props;
        const { checked } = this.state;
  
        this.setState({ checked: !checked }, () => {
          if (!checked) {
            $(`#collapse_${availableSubId}`).collapse('show');
          } else {
            $(`#collapse_${availableSubId}`).collapse('hide');
          }
  
          callback(event, this.props, this.state);
        });
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
          <button className='btn btn-large' type="button" onClick={this.handleClick}>Add To Cart</button>
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
