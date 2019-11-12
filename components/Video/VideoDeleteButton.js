import React, { useState } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Button, Icon, Confirm, Loader } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import { useDeleteAudVidMutation } from './videoHooks';
import { useLocalStateQuery } from '../Authentication/authHooks';

const VideoDeleteButton = ({ id, audioId, title, userId }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const { contentLanguage } = useLocalStateQuery();
  const [deleteAudVid, { loading, error }] = useDeleteAudVidMutation(
    contentLanguage,
    userId
  );
  const onConfirmDelete = async () => {
    setOpenConfirm(false);
    const { data } = deleteAudVid({
      variables: { id, audioId },
      // onCompleted: () => Router.push('/'),
    });
    // if (data) Router.push('/');
  };
  if (error) return <Error error={error} />;
  if (loading)
    return (
      <Loader active inline="centered">
        Đang xoá video...
      </Loader>
    );
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
        onConfirm={onConfirmDelete}
        cancelButton="Huỷ"
        confirmButton="Xác nhận"
        content={`Xác nhận xoá Video: ${title}`}
        header="Chú ý!"
      />
    </>
  );
};

VideoDeleteButton.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  audioId: PropTypes.string,
};

VideoDeleteButton.defaultProps = {
  audioId: null,
};

export default VideoDeleteButton;
