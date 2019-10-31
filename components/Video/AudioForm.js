import React, { Component } from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class AudioForm extends Component {
  fileInputRef = React.createRef();

  render() {
    const { setAddVideoState } = this.props;
    return (
      <>
        <Button
          content="Choose File"
          labelPosition="left"
          icon="file"
          onClick={() => this.fileInputRef.current.click()}
        />
        <input
          ref={this.fileInputRef}
          type="file"
          id="file"
          name="file"
          accept=".mp3,.aac,.aiff,.amr,.flac,.m4a,.ogg,.wav"
          hidden
        />
        <Form.Input
          label="YouTube link hoặc ID"
          placeholder="youtube.com/watch?v=36A5bOSP334 hoặc 36A5bOSP334"
        />
        <div className="buttons">
          <Button
            icon
            labelPosition="left"
            onClick={() => setAddVideoState({ activeStep: 'video' })}
          >
            Quay lại
            <Icon name="left arrow" />
          </Button>
          <Button
            icon
            labelPosition="right"
            primary
            onClick={() => setAddVideoState({ activeStep: 'info' })}
          >
            Tiếp tục
            <Icon name="right arrow" />
          </Button>
        </div>
      </>
    );
  }
}

AudioForm.propTypes = {
  setAddVideoState: PropTypes.func.isRequired,
};
