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

    
  }

  

  /*
   * LIFECYCLE METHODS
   */
  componentDidMount() {
    fetch(
    "https://jsonplaceholder.typicode.com/users")
        .then((res) => res.json())
        .then((json) => {
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
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div> ;
   
        return (
            <div className = "App">
                <h1> Fetch data from an api in react </h1>  {
                    items.map((item) => ( 
                    <ol key = { item.id } >
                        User_Name: { item.username }, 
                        Full_Name: { item.name }, 
                        User_Email: { item.email } 
                        </ol>
                    ))
                }
            </div>
        );
  }
}

App.contextType = AppContext;

export default App;
