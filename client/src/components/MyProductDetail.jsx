/* eslint-disable no-param-reassign */

import React from 'react';

import $ from 'jquery';
import { cloneDeep, isEqual, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import AppContext from '../AppContext';
import MyProductService from '../services/product-service';

class MyProductService extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          fieldGroups: [],
          locale: {
            businessUnit: null,
            language: null,
          },
          wsException: false,
        };
    
        this.pathname = window.location.pathname.replace(/\//gi, '');
        this.urlParams = new URLSearchParams(window.location.search);
        this.sku = this.urlParams.get('sku');
        this.effectiveAccountId = this.urlParams.get('effectiveAccountId');
    
        this.wsEndpoint = new MySubscriptionsService(this.sku, this.effectiveAccountId, '/api',);
    
        /*
         * EVENT HANDLERS
         */
    }

    /*
    * LIFECYCLE METHODS
    */

    componentDidMount() {
        const { value } = this.context;

        this.setState({ locale: { ...value.locale } });
    }

    render() {
        const { value } = this.context;
        const { sku } = this.props;
        const { wsException } = this.state;
    
        return (
          <>
            <div className="row">
              <div className="col-12">
                {sku}
              </div>
            </div>
          </>
        );
      }
}

MyProductService.contextType = AppContext;

MyProductService.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MyProductService;