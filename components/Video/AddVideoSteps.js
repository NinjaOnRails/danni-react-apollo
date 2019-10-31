import React from 'react';
import { Step, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default function AddVideoSteps({ activeStep }) {
  return (
    <Step.Group fluid unstackable>
      <Step active={activeStep === 'video'} completed={activeStep !== 'video'}>
        <Icon name="video" />
        <Step.Content>
          <Step.Title>Video</Step.Title>
        </Step.Content>
      </Step>

      <Step
        active={activeStep === 'audio'}
        completed={activeStep === 'publish'}
        disabled={activeStep === 'video'}
      >
        <Icon name="volume up" />
        <Step.Content>
          <Step.Title>Audio</Step.Title>
        </Step.Content>
      </Step>

      <Step
        active={activeStep === 'publish'}
        disabled={activeStep !== 'publish'}
      >
        <Icon name="info" />
        <Step.Content>
          <Step.Title>Xác nhận</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  );
}

AddVideoSteps.propTypes = {
  activeStep: PropTypes.string,
};

AddVideoSteps.defaultProps = {
  activeStep: 'video',
};
