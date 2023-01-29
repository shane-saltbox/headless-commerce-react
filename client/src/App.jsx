import React from 'react';

import { isEqual, merge } from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppContext from './AppContext';

import MyProductService from './services/product-service';
import {
  Header,
  Main
} from './landmarks';
import { MyProduct } from './components';

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
    
    /*
        * EVENT HANDLERS
        */
    this.fetchData = () => {
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
    };

    
  }

  

  /*
   * LIFECYCLE METHODS
   */
    componentDidMount() {
        
    }

    componentDidUpdate(prevProps, prevState) {
        this.fetchData();
    }


  render() {
    const { DataisLoaded, items } = this.state;
    let itemsArray = [];
    itemsArray.push(items);
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div> ;
   
        return (
            <div className = "App">
                <h1> Fetch data from an api in react </h1>  {
                    itemsArray.map((item) => ( 
                    <ol >
                        User_Name: { item.data.products[0].sku },
                        Name: {item.data.products[0].fields.Name} 
                        </ol>
                    ))
                }
            </div>
        );
  }
}

App.contextType = AppContext;

export default App;
