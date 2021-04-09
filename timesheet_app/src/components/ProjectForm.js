/** @format */

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const ProjectForm = props => {
  const { fields, action, initialValues } = props;

  return (
    <Formik
      initialValues={initialValues}
      validate={values => {
        const errors = {};

        Object.entries(values).forEach(([key, value]) => {
          if (!value) {
            errors[key] = 'Field is required';
          }
        });

        return errors;
      }}
      onSubmit={(values, actions) => props.onSubmitAction(values, actions)}>
      {({ isSubmitting }) => (
        <Form>
          {fields?.map((field, index) => {
            return (
              <div className="input-wrapper" key={index}>
                <label htmlFor={field.name}>{field.label}</label>
                <Field type={field.type} id={field.name} name={field.name} />
                <div className="input-error-message">
                  <ErrorMessage name={field.name}>
                    {msg => <p className="input-error-message">{msg}</p>}
                  </ErrorMessage>
                </div>
              </div>
            );
          })}

          {action && (
            <div className="form-footer">
              <button
                className={action.className ? action.className : ''}
                type="submit"
                disabled={isSubmitting}>
                {action.label}
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ProjectForm;
