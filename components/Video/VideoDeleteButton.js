import React, { Component } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class VideoDeleteButton extends Component {
  state = { openConfirm: false };

  render() {
    const { openConfirm } = this.state;
    const { deleteAudVid, id, audioId, title } = this.props;

    return (
      <>
        <Button
          icon
          labelPosition="left"
          color="red"
          onClick={() => this.setState({ openConfirm: true })}
        >
          <Icon name="trash" />
          Xoá
        </Button>
        <Confirm
          size="large"
          open={openConfirm}
          onCancel={() => this.setState({ openConfirm: false })}
          onConfirm={() => {
            deleteAudVid({ variables: { id, audioId } });
            this.setState({ openConfirm: false });
          }}
          cancelButton="Huỷ"
          confirmButton="Xác nhận"
          content={`Xác nhận xoá Video: ${title}`}
          header="Chú ý!"
        />
      </>
    );
  }
}

VideoDeleteButton.propTypes = {
  deleteAudVid: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  audioId: PropTypes.string,
};

VideoDeleteButton.defaultProps = {
  audioId: null,
};
