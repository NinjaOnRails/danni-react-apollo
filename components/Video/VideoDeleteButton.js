import React, { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const VideoDeleteButton = ({ deleteAudVid, id, audioId, title }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      <Button
        icon
        labelPosition="left"
        color="red"
        onClick={() => setOpenConfirm(true)}
      >
        <Icon name="trash" />
        Xoá
      </Button>
      <Confirm
        size="large"
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          deleteAudVid({ variables: { id, audioId } });
          setOpenConfirm(false);
        }}
        cancelButton="Huỷ"
        confirmButton="Xác nhận"
        content={`Xác nhận xoá Video: ${title}`}
        header="Chú ý!"
      />
    </>
  );
};

VideoDeleteButton.propTypes = {
  deleteAudVid: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  audioId: PropTypes.string,
};

VideoDeleteButton.defaultProps = {
  audioId: null,
};

export default VideoDeleteButton;
