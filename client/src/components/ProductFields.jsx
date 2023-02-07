import React from 'react';

import PropTypes from 'prop-types';

import AppContext from '../AppContext';

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
      <div className="row">
          <div className="col-12">
            <h1>{productName}</h1>
            <p>SKU: {productSku}</p>
            <p>{productDesc}</p>
          </div>
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
