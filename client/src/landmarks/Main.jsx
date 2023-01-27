import React from 'react';

import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import AppContext from '../AppContext';

import { Section } from '../elements';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.pathname = props.location.pathname.replace(/\//gi, '');

    this.sidebarRefs = {};
  }
  /*
   * LIFECYCLE METHODS
   */

  renderSections() {
    const { sections } = this.props;

    let sectionsFiltered = sections;

    if (this.pathname.length) {
      sectionsFiltered = sectionsFiltered.filter((section) => section.id === this.pathname);
    }

    return sectionsFiltered.map((section) => {
      this.sidebarRefs[section.id] = React.createRef();

      return (
        <Section description={section.description} headline={section.headline} id={section.id} key={section.id} sidebarRef={this.sidebarRefs[section.id]} />
      );
    });
  }

  render() {
    const { value } = this.context;
    const { heroHeadline, heroImg, sections } = this.props;

    return (
      <main>
        <form>
          <Route exact path="/">
            {value.settings.hero_isEnabled ? (
              <div className="container-fluid">
                <div className={`hero ${value.settings.hero_heightIsFixed ? 'fixedHeight' : ''}`} style={heroImg.url ? { backgroundImage: `url(${heroImg.url})` } : {}}>
                  <div className="container">
                    <h1 className={`hero-heading ${value.settings.hero_headlineAlignment}`}>{heroHeadline}</h1>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </Route>
          <div className="container-lg pt-5">
            <div className="row">
              <Route exact path="/">
                <div className="col-lg-3">
                  
                </div>
              </Route>
              <div className={this.pathname.length ? 'col-12' : 'col-lg-9'}>
                {this.renderSections()}
              </div>
            </div>
          </div>
        </form>
        
      </main>
    );
  }
}

Main.defaultProps = {
  heroHeadline: null,
};

Main.propTypes = {
  heroHeadline: PropTypes.string,
  heroImg: PropTypes.shape({
    link: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape().isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      headline: PropTypes.string,
      id: PropTypes.string,
      order: PropTypes.number,
    }),
  ).isRequired,
};

Main.contextType = AppContext;

export default Main;
