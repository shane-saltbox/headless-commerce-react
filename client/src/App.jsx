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
import { ProductFields } from './components';

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

  }


  /*
   * LIFECYCLE METHODS
   */
    componentDidMount() {
        const url = "https://headless-commerce.herokuapp.com/api/productDetail?sku=800984&effectiveAccountId=0015e00000MMkzQAAT";

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
    }
    

    componentDidUpdate(prevProps, prevState) {
    }


  render() {
    const { DataisLoaded, items } = this.state;
    let itemsArray = [];
    itemsArray.push(items);
    console.log('##DEBUG itemsArray: '+itemsArray);
    
    let productFields;
    if(DataisLoaded){
        productFields = itemsArray.map((item) => {

            let productDetail = null;
            console.log('##DEBUG item: '+item);

            const productSku = item.data.products[0].sku;
            const productName = item.data.products[0].fields.Name;
            const productDesc = item.data.products[0].fields.Description;
            productDetail = <ProductFields productSku={item.data.products[0].sku} productName={item.data.products[0].fields.Name} productDesc={item.data.products[0].fields.Description} />
        
            return productDetail;
        });
    }
    
        if (!DataisLoaded) return (
            <Router>
                <Route exact path="/">
                    <Header logo="/tinyHomesLogo.png" />
                </Route>
            <Skeleton height={52} width={75} /><h1> Pleses wait some time.... </h1>  
            </Router>
            );
   
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
