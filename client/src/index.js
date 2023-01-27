import 'array-flat-polyfill';
import cssVars from 'css-vars-ponyfill';
import 'polyfill-array-includes';
import 'react-app-polyfill/ie11';
import 'url-search-params-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { Helmet } from 'react-helmet';

import AppContext from './AppContext';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

import 'bootstrap/dist/js/bootstrap.bundle';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableSubId: null,
      globalAlert: {
        dismissed: true,
        message: '',
        type: 'success',
      },
      id: null,
      locale: {
        businessUnit: null,
        language: null,
      },
      roadblocked: false,
      settings: {},
      strings: {},
      theme: {
        borderRadius: null,
        colors: {
          brandPrimary: null,
          buttonDefault: null,
          buttonHover: null,
          formCheckActive: null,
          formCheckActiveHover: null,
          formCheckDefault: null,
          formCheckHover: null,
          formSwitchActive: null,
          formSwitchDefault: null,
          formSwitchDisabled: null,
          formSwitchHover: null,
          heroText: null,
        },
        fontFamily: null,
      },
			wsStatus: 'idle',
    };

    this.urlParams = new URLSearchParams(window.location.search);

    /*
     * HELPER METHODS
     */

    this.setSharedContext = (globalAlert, locale, roadblocked, settings, strings, theme, wsStatus) => {
      this.setState({
        globalAlert,
        locale,
        roadblocked,
        settings,
        strings,
        theme,
				wsStatus,
      }, () => {
        this.urlParams.set('langBU', `${locale.language}-${locale.businessUnit}`);

        window.history.replaceState({}, '', `${window.location.pathname}?${this.urlParams}`);
      });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidMount() {
    
    // Instantiate the CSS Variables Ponyfill. (SEE: https://jhildenbiddle.github.io/css-vars-ponyfill/)
    cssVars({ watch: true });
  }

  render() {
    const { settings, strings, theme } = this.state;

  }
}

const rootElement = document.getElementById('root');

ReactDOM.render(<Index />, rootElement);
