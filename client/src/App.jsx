import React from 'react';

import { isEqual, merge } from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppContext from './AppContext';
import Skeleton from 'react-loading-skeleton';

import MyProductService from './services/product-service';
import {
  Header,
  Main
} from './landmarks';
import { ProductFields } from './elements';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        items: [],
        DataisLoaded: false,
        productFields: [],
        productContext: {
            sku: null,
            effectiveAccountId: null,
        },
    };

    this.wsEndpoint = new MyProductService(this.sku, this.effectiveAccountId, '/api',);

    
  }

  

  /*
   * LIFECYCLE METHODS
   */
    componentDidMount() {
        fetch(
            "https://headless-commerce.herokuapp.com/api/productDetail?sku=800984&effectiveAccountId=0015e00000MMkzQAAT")
                .then((res) => res.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    this.setState({
                        items: json,
                        DataisLoaded: true
                    });
                })
    }

    componentDidUpdate(prevProps, prevState) {
    }


  render() {
    const { DataisLoaded, items } = this.state;
    let itemsArray = [];
    itemsArray.push(items);
    
        const productFields = itemsArray.map((item) => {

            let productDetail = null;

            const productSku = item.data.products[0].sku;
            const productName = item.data.products[0].fields.Name;
            const productDesc = item.data.products[0].fields.Description;
            productDetail = <ProductFields productSku={item.data.products[0].sku} productName={item.data.products[0].fields.Name} productDesc={item.data.products[0].fields.Description} />
        
            return productDetail;
        });
    
        if (!DataisLoaded) return <div>
            <Skeleton height={52} width={75} /><h1> Pleses wait some time.... </h1> </div> ;
   
        return (
            <Router>
                <Route exact path="/">
                    <Header logo="/tinyHomesLogo.png" />
                </Route>
                
                <div className = "App">
                    <h1> Fetch data from an api in react </h1>  
                    {productFields}
                </div>
                
            </Router>
        );
  }
}

App.contextType = AppContext;

export default App;
