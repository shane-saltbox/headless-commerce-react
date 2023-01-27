import React from 'react';

import $ from 'jquery';
import { isEqual, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import AppContext from '../AppContext';
import { WS_STATUS } from '../Constants';
import {
  EmailInput,
  MultiSelect,
  TelephoneInput,
  TextInput,
} from '../elements';
import MyProfileService from '../services/myprofile-service';

class MyProfile extends React.Component {
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

    this.wsEndpoint = new MyProfileService(null, null, null, '/api');

    /*
     * EVENT HANDLERS
     */

    this.onBlurInput = (event, inputProps, inputState) => {
      const { value, setValue } = this.context;
      const inputValue = (inputState.value.length) ? inputState.value : ' ';

      // Set wsStatus context value.
      setValue(
        { ...value.globalAlert },
        { ...value.locale },
        value.roadblocked,
        { ...value.settings },
        { ...value.strings },
        { ...value.theme },
        WS_STATUS.STATE.ACTIVE,
      );

      this.wsEndpoint.patch(inputProps.id, inputProps.mappedField, inputValue)
        .then((response) => {
          if (response.success) {
            // Set wsStatus context value.
            setValue(
              { ...value.globalAlert },
              { ...value.locale },
              value.roadblocked,
              { ...value.settings },
              { ...value.strings },
              { ...value.theme },
              WS_STATUS.STATE.COMPLETE,
            );
          } else {
            $('#exceptionModal').modal();
          }
        })
        .catch(() => {
          this.setState({ wsException: true });
        });
    };

    this.onChangeMultiSelect = (selections, multiSelectProps) => {
      const { value, setValue } = this.context;

      let fieldValue = ' ';

      // Set wsStatus context value.
      setValue(
        { ...value.globalAlert },
        { ...value.locale },
        value.roadblocked,
        { ...value.settings },
        { ...value.strings },
        { ...value.theme },
        WS_STATUS.STATE.ACTIVE,
      );

      if (Array.isArray(selections)) {
        fieldValue = selections.map((selection) => selection.value).join(';');
        if (fieldValue === '') { fieldValue = ' '; }
      } else if (selections !== null) {
        fieldValue = selections.value;
      }

      this.wsEndpoint.patch(multiSelectProps.id, multiSelectProps.mappedField, fieldValue)
        .then((response) => {
          if (response.success) {
            // Set wsStatus context value.
            setValue(
              { ...value.globalAlert },
              { ...value.locale },
              value.roadblocked,
              { ...value.settings },
              { ...value.strings },
              { ...value.theme },
              WS_STATUS.STATE.COMPLETE,
            );
          } else {
            $('#exceptionModal').modal();
          }
        })
        .catch(() => {
          this.setState({ wsException: true });
        });
    };

    /*
     * HELPER METHODS
     */

    this.fetchData = () => {
      const { setValue, value } = this.context;

      this.wsEndpoint.get()
        .then((response) => {
          const { data, success } = response;

          if (success === false) {
            setValue(
              { ...value.globalAlert },
              { ...value.locale },
              true,
              { ...value.settings },
              { ...value.strings },
              { ...value.theme },
              value.wsStatus,
            );
          } else {
            const sortedfieldGroups = sortBy(data, 'order');

            this.setState({ fieldGroups: sortedfieldGroups });
          }
        })
        .catch(() => {
          this.setState({ wsException: true });
        });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidMount() {
    const { value } = this.context;

    this.setState({ locale: { ...value.locale } });
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.context;
    const { locale } = this.state;

    if (!isEqual(value.locale, locale)) {
      this.setState({ locale: { ...value.locale } });
    }

    if (!isEqual(prevState.locale, locale)) {
      this.wsEndpoint.id = value.id;
      this.wsEndpoint.bu = value.locale.businessUnit;
      this.wsEndpoint.lang = value.locale.language;

      this.fetchData();
    }
  }

  renderControlType(attributes) {
    switch (attributes.controlType) {
      case 'Email':
        return <EmailInput callback={this.onBlurInput} defaultValue={attributes.value} disabled={attributes.disabled} id={attributes.id} label={attributes.label} mappedField={attributes.mappedField} placeholder={attributes.placeholder} required={attributes.required} />;
      case 'Multi-Picklist':
      case 'Picklist':
        return <MultiSelect callback={this.onChangeMultiSelect} controlType={attributes.controlType} disabled={attributes.disabled} id={attributes.id} label={attributes.label} mappedField={attributes.mappedField} options={attributes.options} placeholder={attributes.placeholder} required={attributes.required} value={attributes.value} />;
      case 'Tel':
        return <TelephoneInput callback={this.onBlurInput} defaultValue={attributes.value} disabled={attributes.disabled} id={attributes.id} label={attributes.label} mappedField={attributes.mappedField} placeholder={attributes.placeholder} required={attributes.required} />;
      case 'Text':
        return <TextInput callback={this.onBlurInput} defaultValue={attributes.value} disabled={attributes.disabled} id={attributes.id} label={attributes.label} mappedField={attributes.mappedField} placeholder={attributes.placeholder} required={attributes.required} />;
      default:
        return null;
    }
  }

  render() {
    const { value } = this.context;
    const { id } = this.props;
    const { fieldGroups, wsException } = this.state;

    const mappedFieldGroups = fieldGroups.map((fieldGroup) => (
      <div className="col-lg-6" key={fieldGroup.id}>
        {this.renderControlType(fieldGroup)}
      </div>
    ));

    return (
      <div>
        <div className={`alert alert-danger${wsException ? '' : ' d-none'}`} role="alert">
          <svg className="bi bi-alert-circle-fill" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.998 3a1 1 0 112 0 1 1 0 01-2 0zM10 6a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 6z" clipRule="evenodd" />
          </svg>
          {value.strings.wsGetError}
        </div>
        <div className="row">
          {mappedFieldGroups}
        </div>
        <Route exact path={`/${id}`}>
          <div className="row">
            <div className="col-12">
              <button className="btn btn-lg btn-primary" id="btn-save" onClick={this.onClickSaveButton} type="button">
                {value.strings.button_submit}
              </button>
            </div>
          </div>
        </Route>
      </div>
    );
  }
}

MyProfile.contextType = AppContext;

MyProfile.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MyProfile;
