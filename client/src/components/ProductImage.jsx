import React from 'react';

import PropTypes from 'prop-types';

import AppContext from '../AppContext';

import 'bootstrap/dist/js/bootstrap.bundle';

class ProductImage extends React.Component {
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
      productImage,
    } = this.props;

    return (
      <div className="product-large-image-wrapper">
          {productImage ? (
          <img
            src={productImage}
            alt=""
            className="img-fluid"
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

ProductImage.contextType = AppContext;


ProductImage.propTypes = {
  productImage: PropTypes.string.isRequired,
};

export default ProductImage;
