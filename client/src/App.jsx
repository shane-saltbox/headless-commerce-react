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
        actualData,
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

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.context;
    const { productContext } = this.state;

    if (!isEqual(value.productContext, productContext)) {
      this.setState({ productContext: { ...value.productContext } });
    }

    if (!isEqual(prevState.productContext, productContext)) {
      this.wsEndpoint.sku = value.productContext.sku;
      this.wsEndpoint.effectiveAccountId = value.productContext.effectiveAccountId;

      //this.fetchData();
    }
    const getData = async () => {
        try {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts?_limit=8`
          );
          if (!response.ok) {
            throw new Error(
              `This is an HTTP error: The status is ${response.status}`
            );
          }
          let actualData = await response.json();
          setData(actualData);
          setError(null);
        } catch(err) {
          setError(err.message);
          setData(null);
        }
    }

    getData()
  }

  renderMain() {
    const { value } = this.context;
    const { productFields } = this.state;

    let content = null;

    if (value.roadblocked) {
      content = '';
    } else {
      content = productFields.products;
    }

    return content;
  }

  render() {
    const { data } = this.state;

    return (
        <div className="App">
            <ul>
                {data &&
                data.map(({ id, title }) => (
                    <li key={id}>
                    <h3>{title}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
  }
}

App.contextType = AppContext;

export default App;
