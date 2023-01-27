import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { StatusIndicator } from '../components';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    /*
     * EVENT HANDLERS
     */

    this.onClickMenuItem = (event) => {
      event.preventDefault();

      const $this = $(event.target);
      const $anchor = $(`a[name="${$this.attr('href').replace('#', '')}"]`);
      const $header = $('header');

      // Send GTM custom event.
      window.dataLayer.push({
        data: $this.attr('href'),
        event: 'Primary Nav Item Click',
        'gtm.element': event.target,
        'gtm.elementClasses': event.target.className || '',
        'gtm.elementId': event.target.id || '',
        'gtm.elementTarget': event.target.target || '',
        'gtm.elementUrl': event.target.href || event.target.action || '',
        'gtm.originalEvent': event,
      });

      $('html, body').animate({
        scrollTop: $anchor.offset().top - $header.outerHeight(),
      }, 'fast');
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  render() {
    const { sections, refs } = this.props;

    const listItems = sections.map((section) => (
      <li id={section.id} key={section.id} ref={refs[section.id]}><a href={`#${section.id}`} onClick={this.onClickMenuItem}>{section.headline}</a></li>
    ));

    return (
      <div className="sidebar">
        <ul className="sidebar-links list-unstyled">
          {listItems}
        </ul>
        <StatusIndicator />
      </div>
    );
  }
}

Sidebar.contextType = AppContext;

Sidebar.propTypes = {
  refs: PropTypes.shape().isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      headline: PropTypes.string,
      id: PropTypes.string,
      order: PropTypes.number,
    }),
  ).isRequired,
};

export default Sidebar;
