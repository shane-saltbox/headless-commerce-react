import React from 'react';

import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Link } from "react-router-dom";
import { deleteFromCart } from "../slices/cart-slice"

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
      cartItems
    } = this.props;
    
    return (
      <div className="shopping-cart-content">
        {cartItems && cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item) => {
                const discountedPrice = item.price;
                const finalProductPrice = item.price;
                const finalDiscountedPrice = discountedPrice;


                return (
                  <li className="single-shopping-cart" key={item.cartItemId}>
                    <div className="shopping-cart-img">
                      <Link to={process.env.PUBLIC_URL + "/product/" + item.id}>
                        <img
                          alt=""
                          src={item.productDetails.thumbnailImage.url}
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="shopping-cart-title">
                      <h4>
                        <Link
                          to={process.env.PUBLIC_URL + "/product/" + item.id}
                        >
                          {" "}
                          {item.name}{" "}
                        </Link>
                      </h4>
                      <h6>Qty: {item.quantity}</h6>
                      <span>
                        {discountedPrice !== null
                          ? '$' + finalDiscountedPrice
                          : '$' + finalProductPrice}
                      </span>
                      {item.selectedProductColor &&
                      item.selectedProductSize ? (
                        <div className="cart-item-variation">
                          <span>Color: {item.selectedProductColor}</span>
                          <span>Size: {item.selectedProductSize}</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="shopping-cart-delete">
                      <button>
                        <i className="fa fa-times-circle" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="shopping-cart-total">
              <h4>
                Total :{" "}
                <span className="shop-total">
                  {/* {'$' + cartTotalPrice.toFixed(2)} */}
                </span>
              </h4>
            </div>
            {/* <div className="shopping-cart-btn btn-hover text-center">
              <Link className="default-btn" to={process.env.PUBLIC_URL + "/cart"}>
                view cart
              </Link>
              <Link
                className="default-btn"
                to={process.env.PUBLIC_URL + "/checkout"}
              >
                checkout
              </Link>
            </div> */}
          </>
        ) : (
          <p className="text-center">No items added to cart</p>
        )}
      </div>
    )
  };
}

MenuCart.contextType = AppContext;

MenuCart.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MenuCart;
