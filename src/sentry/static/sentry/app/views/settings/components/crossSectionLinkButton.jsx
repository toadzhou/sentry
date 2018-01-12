import styled from 'react-emotion';
import PropTypes from 'prop-types';
import React from 'react';

import Link from '../../../components/link';
import InlineSvg from '../../../components/inlineSvg';

const CrossSectionLinkButtonText = styled('div')`
  flex-grow: 1;
`;

const StyledInlineSvg = styled(InlineSvg)`
  margin-right: 0.75em;
`;

const CrossSectionLinkButton = styled(({to, children, icon, ...props}) => (
  <Link to={to} {...props}>
    {icon && <StyledInlineSvg src={icon} size="1.5em" />}
    <CrossSectionLinkButtonText>{children}</CrossSectionLinkButtonText>
    <InlineSvg src="icon-chevron-right" size="1em" />
  </Link>
))`
  display: flex;
  align-items: center;
  background-color: ${t => t.theme.yellowLightest};
  color: ${t => t.theme.gray5};
  border: 1px dashed ${t => t.theme.borderDark};
  padding: 1em;
  border-radius: 0.25em;
  transition: 0.2s border-color;

  &:hover {
    border-color: ${t => t.theme.blueLight};
  }
`;

CrossSectionLinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

export default CrossSectionLinkButton;
