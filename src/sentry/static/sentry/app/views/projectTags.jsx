import {Box, Flex} from 'grid-emotion';
import React from 'react';
import styled from 'react-emotion';

import {t} from '../locale';
import AsyncView from './asyncView';
import ExternalLink from '../components/externalLink';
import LinkWithConfirmation from '../components/linkWithConfirmation';
import Panel from './settings/components/panel';
import PanelBody from './settings/components/panelBody';
import PanelHeader from './settings/components/panelHeader';
import Row from './settings/components/row';

const Description = styled.div`
  font-size: 0.8em;
  color: ${p => p.theme.gray1};
`;

export default class ProjectTags extends AsyncView {
  getEndpoints() {
    let {projectId, orgId} = this.props.params;
    return [['tags', `/projects/${orgId}/${projectId}/tags/`]];
  }

  onDelete(key, idx) {
    let {projectId, orgId} = this.props.params;

    this.api.request(`/projects/${orgId}/${projectId}/tags/${key}/`, {
      method: 'DELETE',
      success: () => {
        let tags = this.state.tags.slice();
        tags.splice(idx, 1);
        this.setState({tags});
      },
      error: () => {
        this.setState({
          error: true,
          loading: false,
        });
      },
    });
  }

  renderBody() {
    return (
      <div>
        <h2>{t('Tags')}</h2>
        <p>
          Each event in Sentry may be annotated with various tags (key and value pairs).
          Learn how to{' '}
          <ExternalLink href="https://docs.sentry.io/hosted/learn/context/">
            add custom tags
          </ExternalLink>
          .
        </p>

        <Panel>
          <PanelHeader>
            <Flex>
              <Box flex="1">{t('Tags')}</Box>
            </Flex>
          </PanelHeader>

          <PanelBody>
            {this.state.tags.map(({key, name}, idx) => {
              return (
                <Row key={key}>
                  <Flex direction="column" justify="center" flex="1" p={2}>
                    <Box mb={1}>{name}</Box>
                    <Description>{key}</Description>
                  </Flex>
                  <Flex align="center" p={2}>
                    <LinkWithConfirmation
                      className="btn btn-sm btn-default"
                      title={'Remove tag?'}
                      message={'Are you sure you want to remove this tag?'}
                      onConfirm={() => this.onDelete(key, idx)}
                    >
                      <span className="icon icon-trash" />
                    </LinkWithConfirmation>
                  </Flex>
                </Row>
              );
            })}
          </PanelBody>
        </Panel>
      </div>
    );
  }
}
