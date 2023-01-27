import React from 'react';

import { isEqual, merge } from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppContext from './AppContext';
import { GlobalAlert } from './components';

import ConfigService from './services/config-service';
import {
  Header,
  Main
} from './landmarks';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locale: {
        businessUnit: null,
        language: null,
      },
      managedContent: {
        images: {
          hero: {
            link: null,
            url: null,
          },
          logo: {
            link: null,
            url: null,
          },
        },
        links: {
          footer: [],
        },
        sections: [
          {
            description: null,
            headline: null,
            id: 'placeholder-0',
            order: 0,
          },
          {
            description: null,
            headline: null,
            id: 'placeholder-1',
            order: 1,
          },
          {
            description: null,
            headline: null,
            id: 'placeholder-2',
            order: 2,
          },
        ],
      },
    };

    this.wsEndpoint = new ConfigService(null, null, '/api');

    /*
    * HELPER METHODS
    */

    this.fetchData = () => {
      const { setValue, value } = this.context;

      this.wsEndpoint.get().then((data) => {
        setValue(
          { ...value.globalAlert },
          { ...value.locale },
          value.roadblocked,
          merge({ ...value.settings }, data.settings),
          merge({ ...value.strings }, data.strings),
          merge({ ...value.theme }, data.theme),
          value.wsStatus,
        );

        this.setState({ managedContent: data.managedContent });
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

    if (!isEqual(prevState.locale, locale)) {
      this.wsEndpoint.bu = value.locale.businessUnit;
      this.wsEndpoint.lang = value.locale.language;

      this.fetchData();
    }
  }

  renderMain() {
    const { value } = this.context;
    const { managedContent } = this.state;

    let content = null;

    if (value.roadblocked) {
      content = '';
    } else {
      content = <Route path="/" render={(props) => <Main heroImg={managedContent.images.hero} heroHeadline={value.strings.hero_headline} location={props.location} sections={managedContent.sections} />} />;
    }

    return content;
  }

  render() {
    const { value } = this.context;
    const { managedContent } = this.state;

    return (
      <Router>
        <Route exact path="/">
          <GlobalAlert />
          <Header languages={managedContent.languages} logo={managedContent.images.logo} />
        </Route>
        {this.renderMain()}
      </Router>
    );
  }
}

App.contextType = AppContext;

export default App;
