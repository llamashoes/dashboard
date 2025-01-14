/*
Copyright 2019 The Tekton Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * to rename. Details section of a step
 */

import React from 'react';
import { Link } from 'react-router-dom';
import jsYaml from 'js-yaml';
import { urls } from '@tektoncd/dashboard-utils';

import { FormattedMessage, injectIntl } from 'react-intl';
import ResourceTable from '../ResourceTable';

import './StepDefinition.scss';

const resourceTable = (title, namespace, resources, intl) => {
  return (
    <ResourceTable
      title={title}
      rows={resources.map(({ name, resourceRef, resourceSpec }) => ({
        id: name,
        name,
        value:
          resourceRef && resourceRef.name ? (
            <Link
              to={urls.pipelineResources.byName({
                namespace,
                pipelineResourceName: resourceRef.name
              })}
            >
              {resourceRef.name}
            </Link>
          ) : (
            <pre>{jsYaml.dump(resourceSpec)}</pre>
          )
      }))}
      headers={[
        {
          key: 'name',
          header: intl.formatMessage({
            id: 'dashboard.tableHeader.name',
            defaultMessage: 'Name'
          })
        },
        {
          key: 'value',
          header: intl.formatMessage({
            id: 'dashboard.tableHeader.value',
            defaultMessage: 'Value'
          })
        }
      ]}
    />
  );
};

const StepDefinition = ({ definition, intl, taskRun }) => {
  const yaml = jsYaml.dump(
    definition ||
      intl.formatMessage({
        id: 'dashboard.step.definitionNotAvailable',
        defaultMessage: 'description: step definition not available'
      })
  );
  return (
    <div className="step-definition">
      <div className="title">
        <FormattedMessage
          id="dashboard.step.stepDefinition"
          defaultMessage="Step definition"
        />
        :
      </div>
      <pre>{yaml}</pre>
      {taskRun.params && (
        <ResourceTable
          title="Parameters"
          rows={taskRun.params.map(({ name, value }) => ({
            id: name,
            name,
            value
          }))}
          headers={[
            { key: 'name', header: 'Name' },
            { key: 'value', header: 'Value' }
          ]}
        />
      )}
      {taskRun.inputResources &&
        resourceTable(
          'Input Resources',
          taskRun.namespace,
          taskRun.inputResources,
          intl
        )}
      {taskRun.outputResources &&
        resourceTable(
          'Output Resources',
          taskRun.namespace,
          taskRun.outputResources,
          intl
        )}
    </div>
  );
};

StepDefinition.defaultProps = {
  taskRun: {}
};

export default injectIntl(StepDefinition);
