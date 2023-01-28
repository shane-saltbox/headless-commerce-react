/* eslint-disable no-param-reassign */

import React from 'react';

import $ from 'jquery';
import { cloneDeep, isEqual, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import AppContext from '../AppContext';
import MyProductService from '../services/product-service';

class MyProduct extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          productFields: [],
          productContext: {
            sku: null,
            effectiveAccountId: null,
          },
          wsException: false,
        };
    
        this.pathname = window.location.pathname.replace(/\//gi, '');
        this.urlParams = new URLSearchParams(window.location.search);
        this.sku = this.urlParams.get('sku');
        this.effectiveAccountId = this.urlParams.get('effectiveAccountId');
        console.log('##DEBUG sku: '+this.sku);
        console.log('##DEBUG effectiveAccountId: '+this.effectiveAccountId);
    
        this.wsEndpoint = new MyProductService(this.sku, this.effectiveAccountId, '/api',);
        console.log('##DEBUG wsEndpoint: '+JSON.stringify(this.wsEndpoint));
    
        /*
         * EVENT HANDLERS
         */
        this.fetchData = () => {
            this.wsEndpoint.get()
              .then((response) => {
                const { data, success } = response;
                console.log('##DEBUG fetch 1 data: '+data);
      
                if (!success) throw new Error();
      
                this.setState({ productFields: data });
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
        const { value } = this.context;

        this.setState({ productContext: { ...value.sku } });

        this.wsEndpoint.get()
        .then((response) => {
            const { data, success } = response;
            console.log('##DEBUG fetch data: '+data);

            if (!success) throw new Error();

            this.setState({ productFields: data });
            console.log('##DEBUG fetch productFields: '+JSON.stringify(this.state.productFields));
        })
        .catch(() => {
            this.setState({ wsException: true, productFields: [] });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { setValue, value } = this.context;
        const { productFields, productContext } = this.state;

    
        /* if (this.context && value && !isEqual(value.productContext, productContext)) {
          this.setState({ productContext: { ...value.productContext } });
        }
    
        if (!isEqual(prevState.productContext, productContext)) {
          this.wsEndpoint.sku = value.sku;
          this.wsEndpoint.sku = value.productContext.sku;
          this.wsEndpoint.effectiveAccountId = value.productContext.effectiveAccountId;
    
          this.fetchData();
        } */
      }

    render() {
        const { value } = this.context;
        const { sku } = this.props;
        const { productContext, wsException } = this.state;
        console.log('##DEBUG render value: '+JSON.stringify(value));
        console.log('##DEBUG render sku: '+JSON.stringify(sku));
        console.log('##DEBUG render productContext: '+JSON.stringify(productContext));

        /* const mappedFieldGroups = productContext.map((product, index) => {
            console.log('in first map');
            console.log('##DEBUG product: '+JSON.stringify(product));
            let productSection = null;
      
            if (product.products.length) {
                console.log('in second map');
              productSection = product.products.map((product) => (
                <div key={product.id}>
                    <p>Product Id: {product.id}</p>
                  
                </div>
              ));
            }
      
            return productSection;
          }); */
    
        return (
          <>
            <div className="row">
              <div className="col-12">
                <p>SKU#: </p>
                <p>wsEndpoint#: </p>
              </div>
            </div>
          </>
        );
      }
}

MyProduct.contextType = AppContext;

MyProduct.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MyProduct;