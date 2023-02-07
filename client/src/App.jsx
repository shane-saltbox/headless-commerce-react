import React from 'react';

import { cloneDeep, isEqual, sortBy } from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppContext from './AppContext';
import Skeleton from 'react-loading-skeleton';

import MyProductService from './services/product-service';
import {
  Header,
  Main
} from './landmarks';
import { ProductFields, ProductImage, AddToCart } from './components';

class App extends React.Component {
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

    this.pathname = window.location.pathname.replace(/\//gi, '');
    this.urlParams = new URLSearchParams(window.location.search);
    this.sku = this.urlParams.get('sku');
    this.effectiveAccountId = this.urlParams.get('effectiveAccountId');

    /*
     * EVENT HANDLERS
     */

  }


  /*
   * LIFECYCLE METHODS
   */
    componentDidMount() {
        const url = `https://headless-commerce.herokuapp.com/api/productDetail?sku=${this.sku}&effectiveAccountId=${this.effectiveAccountId}`;

        const fetchData = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);
            this.setState({
                items: json,
                DataisLoaded: true
            });
        } catch (error) {
            console.log("error", error);
        }
        };

        fetchData();

        // fetch cart data
        const cartUrl = `https://headless-commerce.herokuapp.com/api/cart`;

        const fetchCartData = async () => {
        try {
            const response = await fetch(cartUrl);
            const json = await response.json();
            console.log(json.data.cartItems);
            this.setState({
                cartItems: json.data.cartItems
            });
        } catch (error) {
            console.log("error cartItems", error);
        }
        };

        fetchCartData();
    }
    

    componentDidUpdate(prevProps, prevState) {
    }


  render() {
    const { DataisLoaded, items, cartItems } = this.state;
    let itemsArray = [];
    itemsArray.push(items);
    console.log('##DEBUG itemsArray: '+itemsArray);
    
    let productFields;
    let productImage;
    let productAddToCart;
    if(DataisLoaded){
        productFields = itemsArray.map((item) => {
            let productDetail = [];
            productDetail = <ProductFields productSku={item.data.products[0].sku} productName={item.data.products[0].fields.Name} productDesc={item.data.products[0].fields.Description} />
            
            return productDetail;
        });

        productImage = itemsArray.map((item) => {
            let productImage = [];
            productImage = <ProductImage productImage={item.data.products[0].defaultImage.url} />

            return productImage;
        });

        productAddToCart = itemsArray.map((item) => {
            let productAddToCart = [];
            productAddToCart = <AddToCart productSku={item.data.products[0].sku} cartItems={cartItems} productAmount="100.00" />

            return productAddToCart;
        });
    }
    
        if (!DataisLoaded) return (
            <Router>
                <Route exact path="/">
                    <Header logo="/tinyHomesLogo.png" />
                </Route>
                <main>
                <div className="container-lg pt-5">
                        <div className="row topRow">
                        <Route exact path="/">
                            <div className="col-lg-4">
                                <Skeleton height={45} />
                            </div>
                        </Route>
                            <div className="col-lg-8">
                                <Skeleton height={45} />
                            </div>
                        </div>
                    </div>  
                </main>
            </Router>
            );
   
        return (
            <Router>
                <Route exact path="/">
                    <Header logo="/tinyHomesLogo.png" cartItems={cartItems} />
                </Route>
                <main>
                    <div className="container-lg pt-5">
                        <div className="row topRow">
                        <Route exact path="/">
                            <div className="col-lg-4">
                                {productImage}
                            </div>
                        </Route>
                            <div className="col-lg-8">
                                {productFields}
                                {productAddToCart}
                            </div>
                        </div>
                    </div>  
                </main>
            </Router>
        );
  }
}

App.contextType = AppContext;

export default App;
