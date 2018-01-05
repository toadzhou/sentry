import {Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'react-emotion';

import {inputStyles} from './styled/styles';
import {selectText} from '../../../../utils/selectText';
import Button from '../../../../components/buttons/button';
import Clipboard from '../../../../components/clipboard';
import InlineSvg from '../../../../components/inlineSvg';

const StyledInput = styled.input`
  ${inputStyles};
  width: 100%;
`;

const OverflowContainer = styled(Flex)``;

const Wrapper = styled(Flex)`
  overflow: hidden;
`;

class TextCopyInput extends React.Component {
  static propTypes = {
    /**
     * Text to copy
     */
    children: PropTypes.string.isRequired,
    /**
     * CSS style object
     */
    style: PropTypes.object,
    /**
     * Custom renderer function, should return a React.Element
     *
     * Renderer is provided an object: {value, ref}
     */
    renderer: PropTypes.func,
    /**
     * If true will apply "flex: 1" to containing element of text
     */
    flexValueContainer: PropTypes.bool,
    onCopy: PropTypes.func,
  };

  static defaultProps = {
    flexValueContainer: true,
    onCopy: () => {},
  };

  constructor(props) {
    super(props);
  }

  defaultRenderer = () => (
    <StyledInput
      readOnly
      disabled
      ref={this.handleAutoMount}
      value={this.props.children}
      style={this.props.style}
    />
  );

  handleSelectText = e => {
    if (!this.textRef) return;
    // We use findDOMNode here because `this.textRef` is not a dom node,
    // it's a ref to AutoSelectText
    // eslint-disable-next-line react/no-find-dom-node
    selectText(ReactDOM.findDOMNode(this.textRef));
  };

  // Select text when copy button is clicked
  handleCopyClick = e => {
    if (!this.textRef) return;

    let {onCopy} = this.props;

    this.handleSelectText();

    onCopy(this.props.children, e);

    e.stopPropagation();
  };

  handleAutoMount = ref => {
    this.textRef = ref;
  };

  render() {
    let {flexValueContainer, children, renderer} = this.props;

    let renderedComponent = renderer
      ? renderer({value: children, ref: this.handleAutoMount})
      : this.defaultRenderer();

    return (
      <Wrapper>
        <OverflowContainer
          flex={flexValueContainer ? '1' : ''}
          onClick={this.handleSelectText}
        >
          {renderedComponent}
        </OverflowContainer>
        <Clipboard hideUnsupported value={children}>
          <Flex shrink="0">
            <Button type="button" borderless size="xsmall" onClick={this.handleCopyClick}>
              <InlineSvg src="icon-copy" />
            </Button>
          </Flex>
        </Clipboard>
      </Wrapper>
    );
  }
}

export default TextCopyInput;
