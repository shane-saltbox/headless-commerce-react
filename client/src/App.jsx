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
        this.wsEndpoint.get()
            .then((response) => {
            const { data, success } = response;
            console.log('##DEBUG fetch 1 data: '+response);
    
            if (!success) throw new Error();
    
            this.setState({
                items: response,
                DataisLoaded: true
            });
            })
            .catch(() => {
            this.setState({ wsException: true, productFields: [] });
        });
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
