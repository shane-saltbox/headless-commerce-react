import 'array-flat-polyfill';
import cssVars from 'css-vars-ponyfill';
import 'polyfill-array-includes';
import 'react-app-polyfill/ie11';
import 'url-search-params-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { CookiesProvider } from 'react-cookie';
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
    const { settings } = this.state;

    const id = (this.urlParams.has('id') ? this.urlParams.get('id') : null);
    const langBU = (this.urlParams.has('langBU') && this.urlParams.get('langBU').split('-').length === 2 ? this.urlParams.get('langBU').split('-') : null);
    const availableSubId = (this.urlParams.has('availableSubId') ? this.urlParams.get('availableSubId') : null);

    if (langBU === null) {
      this.setState({
        roadblocked: true,
      });
    } else {
      const businessUnit = (langBU.length === 2 ? langBU[1] : null);
      const language = (langBU.length === 2 ? langBU[0] : null);

      this.setState({
        availableSubId,
        id,
        locale: { businessUnit, language },
        settings: { ...settings },
      });
    }

    // Instantiate the CSS Variables Ponyfill. (SEE: https://jhildenbiddle.github.io/css-vars-ponyfill/)
    cssVars({ watch: true });
  }

  render() {
    const { settings, strings, theme } = this.state;

    return (
      <>
        <CookiesProvider>
          <AppContext.Provider value={{ value: this.state, setValue: this.setSharedContext }}>
            <Helmet>
              <title>{strings.pageTitle}</title>
              <link rel="icon" href={settings.favIcon} />
              <style>
                {`
                :root {
                  --background: ${theme.colors.background};
                  --banner-background: ${theme.colors.bannerBackground};
                  --border-radius: ${theme.borderRadius};
                  --brand-primary: ${theme.colors.brandPrimary};
                  --brand-secondary: ${theme.colors.brandSecondary};
                  --brand-secondary-hover: ${theme.colors.brandSecondaryHover};
                  --brand-tertiary: ${theme.colors.brandTertiary};
                  --button-default: ${theme.colors.buttonDefault};
                  --button-hover: ${theme.colors.buttonHover};
                  --button-text: ${theme.colors.buttonText};
                  --font-family: ${theme.fontFamily};
                  --form-check-active: ${theme.colors.formCheckActive};
                  --form-check-active-hover: ${theme.colors.formCheckActiveHover};
                  --form-check-default: ${theme.colors.formCheckDefault};
                  --form-check-hover: ${theme.colors.formCheckHover};
                  --form-switch-active: ${theme.colors.formSwitchActive};
                  --form-switch-default: ${theme.colors.formSwitchDefault};
                  --form-switch-disabled: ${theme.colors.formSwitchDisabled};
                  --form-switch-hover: ${theme.colors.formSwitchHover};
                  --hero-text-color:  ${theme.colors.heroText};
                }
                `}
              </style>
              <style>
                {theme.customCss}
              </style>
            </Helmet>
            <App />
          </AppContext.Provider>
        </CookiesProvider>
      </>
    );
  }
}

const rootElement = document.getElementById('root');

ReactDOM.render(<Index />, rootElement);
