import React from 'react';

import { isEqual, merge } from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppContext from './AppContext';

import ProductService from './services/product-service';
import {
  Header,
  Main
} from './landmarks';

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
    const { locale } = this.state;

    if (!isEqual(value.locale, locale)) {
      this.setState({ locale: { ...value.locale } });
    }

    if (!isEqual(prevState.productContext, productContext)) {
      this.wsEndpoint.sku = value.productContext.sku;
      this.wsEndpoint.effectiveAccountId = value.productContext.effectiveAccountId;

      this.fetchData();
    }
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
    const { managedContent } = this.state;

    return (
      <Router>
        {this.renderMain()}
      </Router>
    );
  }
}

App.contextType = AppContext;

export default App;
