import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {browserHistory} from 'react-router';

import ApiMixin from '../../mixins/apiMixin';
import DropdownLink from '../dropdownLink';
import EnvironmentStore from '../../stores/environmentStore';
import LoadingIndicator from '../loadingIndicator';
import LoadingError from '../loadingError';
import GroupState from '../../mixins/groupState';
import GroupReleaseChart from './releaseChart';
import MenuItem from '../menuItem';
import SeenInfo from './seenInfo';
import {toTitleCase} from '../../utils';
import {t} from '../../locale';

const DEFAULT_ENV_NAME = '(Default Environment)';

// TODO(dcramer): this should listen to EnvironmentStore
// changes
const GroupReleaseStats = createReactClass({
  displayName: 'GroupReleaseStats',

  propTypes: {
    group: PropTypes.object,
  },

  mixins: [ApiMixin, GroupState],

  getInitialState() {
    let envList = EnvironmentStore.getAll();
    let defaultEnv = EnvironmentStore.getDefault();

    let queryParams = this.props.location.query;

    let queriedEnvironment = queryParams.environment || '';
    let queriedEnvironmentIsValid =
      queriedEnvironment &&
      envList.filter(e => e.name === queriedEnvironment).length === 0;

    let selectedEnvironment = queriedEnvironmentIsValid ? queriedEnvironment : '';

    return {
      loading: true,
      error: false,
      data: null,
      envList,
      environment: selectedEnvironment || defaultEnv,
    };
  },

  componentWillMount() {
    if (this.state.loading) {
      this.fetchData();
    }
  },

  componentWillReceiveProps(nextProps) {
    let queryParams = nextProps.location.query;
    if (queryParams.environment !== this.props.location.query.environment) {
      this.setState(
        {
          environment: queryParams.environment,
          loading: true,
          error: false,
        },
        this.fetchData
      );
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.loading !== nextState.loading ||
      this.state.error !== nextState.error ||
      this.state.environment !== nextState.environment ||
      this.props.group.id !== nextProps.group.id
    );
  },

  fetchData() {
    let group = this.props.group;
    let env = this.state.environment || 'none';
    let stats = this.props.group.stats['24h'];

    // due to the current stats logic in Sentry we need to extend the bounds
    let until = stats[stats.length - 1][0] + 1;

    this.api.request(`/issues/${group.id}/environments/${env}/`, {
      query: {
        until,
      },
      success: data => {
        this.setState({
          data,
          loading: false,
          error: false,
        });
      },
      error: () => {
        this.setState({
          data: null,
          loading: false,
          error: true,
        });
      },
    });
  },

  switchEnv(env) {
    if (this.state.environment === env) return;

    let queryParams = Object.assign({}, this.props.location.query);
    queryParams.environment = env;

    browserHistory.push({
      pathname: this.props.location.pathname,
      query: queryParams,
    });
  },

  render() {
    let group = this.props.group;
    let projectId = this.getProject().slug;
    let orgId = this.getOrganization().slug;
    let environment = this.state.environment;
    let data = this.state.data || {};
    let firstSeenEnv = data.firstSeen;
    let lastSeenEnv = data.lastSeen;

    let envList = this.state.envList;
    let hasRelease = this.getProjectFeatures().has('releases');

    return (
      <div className="env-stats">
        <h6>
          <span>
            <DropdownLink
              title={environment ? toTitleCase(environment) : DEFAULT_ENV_NAME}
            >
              {envList.map(e => {
                return (
                  <MenuItem
                    key={e.name}
                    isActive={environment === e.name}
                    onClick={this.switchEnv.bind(this, e.name)}
                  >
                    {toTitleCase(e.name) || DEFAULT_ENV_NAME}
                  </MenuItem>
                );
              })}
            </DropdownLink>
          </span>
        </h6>
        <div className="env-content">
          {this.state.loading ? (
            <LoadingIndicator />
          ) : this.state.error ? (
            <LoadingError />
          ) : (
            <div>
              <GroupReleaseChart
                group={group}
                environment={environment}
                environmentStats={data.environment.stats}
                release={data.currentRelease ? data.currentRelease.release : null}
                releaseStats={data.currentRelease ? data.currentRelease.stats : null}
                statsPeriod="24h"
                title={t('Last 24 Hours')}
                firstSeen={group.firstSeen}
                lastSeen={group.lastSeen}
              />

              <GroupReleaseChart
                group={group}
                environment={environment}
                environmentStats={data.environment.stats}
                release={data.currentRelease ? data.currentRelease.release : null}
                releaseStats={data.currentRelease ? data.currentRelease.stats : null}
                statsPeriod="30d"
                title={t('Last 30 Days')}
                className="bar-chart-small"
                firstSeen={group.firstSeen}
                lastSeen={group.lastSeen}
              />

              <h6>
                <span>{t('First seen')}</span>
                {environment && <small>({environment})</small>}
              </h6>

              <SeenInfo
                orgId={orgId}
                projectId={projectId}
                date={firstSeenEnv}
                dateGlobal={group.firstSeen}
                hasRelease={hasRelease}
                environment={environment}
                release={data.firstRelease ? data.firstRelease.release : null}
                title={t('First seen')}
              />

              <h6>
                <span>{t('Last seen')}</span>
                {environment && <small>({environment})</small>}
              </h6>
              <SeenInfo
                orgId={orgId}
                projectId={projectId}
                date={lastSeenEnv}
                dateGlobal={group.lastSeen}
                hasRelease={hasRelease}
                environment={environment}
                release={data.lastRelease ? data.lastRelease.release : null}
                title={t('Last seen')}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
});

export default GroupReleaseStats;
