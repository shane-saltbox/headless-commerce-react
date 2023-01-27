/* eslint-disable no-param-reassign */
import React from 'react';

import $ from 'jquery';
import { cloneDeep, isEqual, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import QandAService from '../services/qanda-service';

import AppContext from '../AppContext';
import { SOURCE, WS_STATUS } from '../Constants';
import Collapsible from './Collapsible';
import { Checkbox, MultiSelect, Radio } from '../elements';

class QandA extends React.Component {
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

    this.wsEndpoint = new QandAService(null, null, null, '/api');

    /*
     * EVENT HANDLERS
     */

    this.onChangeCheckbox = (event, checkboxProps, radioState, debounced) => {
      const { target } = event;
      const { fieldGroups } = this.state;

      const fieldGroupsClone = cloneDeep(fieldGroups);

      const question = (fieldGroupsClone.flatMap((fieldGroup) => fieldGroup.questions.filter((q) => q.id === checkboxProps.id))[0] || null);
      const option = (question.options.filter((a) => a.id === target.id)[0] || null);

      // Set state.
      if (!debounced) {
        // Update the question.
        const valueArray = question.value.split(';');

        if (target.checked) {
          valueArray.push(target.value);
          question.value = valueArray.join(';');
        } else {
          valueArray.splice(valueArray.indexOf(target.value), 1);
          question.value = valueArray.join(';');
        }

        // Update the option.
        option.ischecked = !option.ischecked;

        this.setState({ fieldGroups: fieldGroupsClone });
      } else {
        this.patchData(question);
      }
    };

    this.onChangeMultiSelect = (selections, selectProps, selectState, debounced) => {
      const { fieldGroups } = this.state;

      const fieldGroupsClone = cloneDeep(fieldGroups);

      const question = (fieldGroupsClone.flatMap((fieldGroup) => fieldGroup.questions.filter((q) => q.id === selectProps.id))[0] || null);

      // Update the question.
      if (Array.isArray(selections)) {
        question.value = selections.map((selection) => selection.value).join(';');
      } else {
        question.value = (selections ? selections.value : '');
      }

      // Update the option(s).
      question.options.forEach((o) => {
        o.ischecked = (question.value.split(';').indexOf(o.value) !== -1);
      });

      // Set state.
      this.setState({ fieldGroups: fieldGroupsClone }, () => {
        if (debounced) {
          this.patchData(question);
        }
      });
    };

    this.onChangeRadio = (event, radioProps, radioState, debounced) => {
      const { target } = event;
      const { fieldGroups } = this.state;

      const fieldGroupsClone = cloneDeep(fieldGroups);

      const question = (fieldGroupsClone.flatMap((fieldGroup) => fieldGroup.questions.filter((q) => q.id === radioProps.id))[0] || null);
      const option = (question.options.filter((a) => a.id === target.id)[0] || null);

      // Update the question.
      question.value = target.value;

      // Update the option(s).
      question.options.forEach((o) => {
        o.ischecked = false;
      });

      option.ischecked = target.checked;

      // Set state.
      this.setState({ fieldGroups: fieldGroupsClone }, () => {
        if (debounced) {
          this.patchData(question);
        }
      });
    };

    /*
     * HELPER METHODS
     */

    this.fetchData = () => {
      this.wsEndpoint.get()
        .then((response) => {
          const { data, success } = response;

          if (!success) throw new Error();

          const sortedfieldGroups = sortBy(data, 'catorder');

          sortedfieldGroups.forEach((fieldGroup) => {
            const modifiedFieldGroup = fieldGroup;
            const sortedQuestions = sortBy(fieldGroup.questions, 'order');

            sortedQuestions.forEach((question) => {
              const modifiedQuestion = question;
              const sortedOptions = sortBy(question.options, 'order');

              modifiedQuestion.options = sortedOptions;

              switch (modifiedQuestion.controltype) {
                case 'Checkbox':
                case 'Multi-picklist':
                case 'Picklist':
                  modifiedQuestion.value = sortedOptions.filter((option) => option.ischecked === true).map((option) => option.value).join(';');
                  break;
                case 'Radio':
                  modifiedQuestion.value = sortedOptions.filter((option) => option.ischecked === true).map((option) => option.value).join();
                  break;
                default:
                  break;
              }
            });

            modifiedFieldGroup.questions = sortedQuestions;
          });

          this.setState({ fieldGroups: sortedfieldGroups });
        })
        .catch(() => {
          this.setState({ wsException: true });
        });
    };

    this.patchData = (question) => {
      const { value, setValue } = this.context;

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

      this.wsEndpoint.patch(SOURCE, question)
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
    const { sectionRef, sidebarRef } = this.props;
    const { fieldGroups, locale } = this.state;

    if (!isEqual(value.locale, locale)) {
      this.setState({ locale: { ...value.locale } });
    }

    if (!isEqual(prevState.locale, locale)) {
      this.wsEndpoint.id = value.id;
      this.wsEndpoint.bu = value.locale.businessUnit;
      this.wsEndpoint.lang = value.locale.language;

      this.fetchData();
    }

    if (sectionRef.current && sidebarRef.current && fieldGroups.length === 0) {
      sectionRef.current.classList.add('d-none');
      sidebarRef.current.classList.add('d-none');
    } else if (sectionRef.current && sidebarRef.current && fieldGroups.length >= 0) {
      sectionRef.current.classList.remove('d-none');
      sidebarRef.current.classList.remove('d-none');
    }
  }

  renderControlType(attributes) {
    switch (attributes.controltype) {
      case 'Checkbox':
        return <Checkbox callback={this.onChangeCheckbox} id={attributes.id} options={attributes.options} value={attributes.value} />;
      case 'Multi-picklist':
      case 'Picklist':
        return <MultiSelect callback={this.onChangeMultiSelect} controlType={attributes.controltype} disabled={false} id={attributes.id} mappedField={attributes.mappedField} options={attributes.options} placeholder={attributes.placeholder} value={attributes.value} />;
      case 'Radio':
        return <Radio callback={this.onChangeRadio} id={attributes.id} options={attributes.options} value={attributes.value} />;
      default:
        return null;
    }
  }

  renderFieldGroup(fieldGroup) {
    const hasValue = (question) => question.value !== null;

    const openOnLaunch = (fieldGroup.questions.every(hasValue));

    const tiles = fieldGroup.questions.map((question) => (
      <div className="collapsible-tile" key={question.id}>
        <p><strong>{question.label}</strong></p>
        {question.helpText ? <p>{question.helpText}</p> : null}
        <div className="row">
          <div className="col-12">
            {this.renderControlType(question)}
          </div>
        </div>
      </div>
    ));

    return <Collapsible icon={fieldGroup.icon} id={fieldGroup.id} key={fieldGroup.id} label={fieldGroup.label} openOnLaunch={openOnLaunch} tiles={tiles} />;
  }

  render() {
    const { value } = this.context;
    const { id } = this.props;
    const { fieldGroups, wsException } = this.state;

    const mappedFieldGroups = fieldGroups.map((fieldGroup) => this.renderFieldGroup(fieldGroup));

    return (
      <>
        <div className={`alert alert-danger${wsException ? '' : ' d-none'}`} role="alert">
          <svg className="bi bi-alert-circle-fill" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.998 3a1 1 0 112 0 1 1 0 01-2 0zM10 6a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 6z" clipRule="evenodd" />
          </svg>
          Unable to retrieve profile information at this time. Please try again later.
        </div>
        {mappedFieldGroups}
        <Route exact path={`/${id}`}>
          <div className="row">
            <div className="col-12">
              <button className="btn btn-lg btn-primary" id="btn-save" onClick={this.onClickSaveButton} type="button">
                {value.strings.button_submit}
              </button>
            </div>
          </div>
        </Route>
      </>
    );
  }
}

QandA.contextType = AppContext;

QandA.propTypes = {
  id: PropTypes.string.isRequired,
  sectionRef: PropTypes.shape({
    current: PropTypes.any,
  }).isRequired,
  sidebarRef: PropTypes.shape({
    current: PropTypes.any,
  }).isRequired,
};

export default QandA;
