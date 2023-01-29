import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Badge } from '../components';
import { WS_STATUS } from '../Constants';

import 'bootstrap/dist/js/bootstrap.bundle';

class ProductFields extends React.Component {
  constructor(props) {
    super(props);

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
      productName,
      productDesc,
    } = this.props;

    return (
      <div>
        <h1>{productName}</h1>
        <p>SKU: {productSku}</p>
        <p>{productDesc}</p>
      </div>
    );
  }
}

ProductFields.contextType = AppContext;


ProductFields.propTypes = {
  productSku: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  productDesc: PropTypes.string.isRequired,
};

export default ProductFields;
