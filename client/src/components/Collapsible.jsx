import React from 'react';

import PropTypes from 'prop-types';

class Collapsible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      openOnLaunch: false,
    };

    /*
     * EVENT HANDLERS
     */

    this.onClickCollapsible = () => {
      const { isActive } = this.state;

      this.setState({ isActive: !isActive });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidMount() {
    const { openOnLaunch } = this.props;

    this.setState({
      isActive: openOnLaunch,
      openOnLaunch,
    });
  }

  render() {
    const {
      icon,
      id,
      label,
      tiles,
    } = this.props;
    const { isActive, openOnLaunch } = this.state;

    return (
      <div className={`collapsible${isActive ? ' isActive' : ''}`}>
        <div className="collapsible-bar">
          <h3 className="collapsible-headline" aria-expanded={isActive} aria-controls={id} data-toggle="collapse" data-target={`#${id}`} onClick={this.onClickCollapsible} ref={this.collapsibleRef}>
            {(icon ? <img className="collapsible-icon" alt={label} src={icon} /> : null)}
            {label}
            <svg className="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.646 6.646a.5.5 0 01.708 0L10 12.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clipRule="evenodd" /></svg>
          </h3>
        </div>
        <div className={`collapse${openOnLaunch ? ' show' : ''}`} id={id}>
          {tiles}
        </div>
      </div>
    );
  }
}

Collapsible.defaultProps = {
  callback: null,
  icon: null,
  id: null,
};

Collapsible.propTypes = {
  callback: PropTypes.func,
  icon: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  openOnLaunch: PropTypes.bool.isRequired,
  tiles: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default Collapsible;
