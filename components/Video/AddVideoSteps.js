import React from 'react';
import { Step, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AddVideoSteps = ({ activeStep }) => {
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
        completed={activeStep === 'details'}
        disabled={activeStep === 'video'}
      >
        <Icon name="volume up" />
        <Step.Content>
          <Step.Title>Audio</Step.Title>
        </Step.Content>
      </Step>

      <Step
        active={activeStep === 'details'}
        disabled={activeStep !== 'details'}
      >
        <Icon name="info" />
        <Step.Content>
          <Step.Title>Chi tiết</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  );
};

AddVideoSteps.propTypes = {
  activeStep: PropTypes.string,
};

AddVideoSteps.defaultProps = {
  activeStep: 'video',
};

export default AddVideoSteps;
