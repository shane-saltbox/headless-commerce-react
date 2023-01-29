import React from 'react';

import { isEqual, merge } from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppContext from './AppContext';

import ProductService from './services/product-service';
import {
  Header,
  Main
} from './landmarks';
import { MyProduct } from './components';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        productFields: [],
        productContext: {
            sku: null,
            effectiveAccountId: null,
        },
    };

    this.wsEndpoint = new ProductService(null, null, '/api');

    /*
    * HELPER METHODS
    */

    this.fetchData = () => {
      const { setValue, value } = this.context;

      this.wsEndpoint.get().then((data) => {
        setValue(
            { productFields: data }
        );
      });
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
    this.fetchData();
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
    const { value } = this.context;
    const { productFields } = this.state;

    return (
      <Router>
        <Route exact path="/">
          <MyProduct productData={productFields.products} />
        </Route>
        {this.renderMain()}
      </Router>
    );
  }
}

App.contextType = AppContext;

export default App;
