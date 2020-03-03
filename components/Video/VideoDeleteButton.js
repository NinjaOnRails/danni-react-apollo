import { useState } from 'react';
import { Button, Icon, Confirm, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Error from '../UI/ErrorMessage';
import { useDeleteAudVidMutation } from './videoHooks';

const VideoDeleteButton = ({
  id,
  audioId,
  title,
  userId,
  redirect,
  contentLanguage,
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteAudVid, { loading, error }] = useDeleteAudVidMutation({
    contentLanguage,
    userId,
    redirect,
  });
  const onConfirmDelete = async () => {
    setOpenConfirm(false);
    deleteAudVid({
      variables: { id, audioId },
    });
  };
  if (error) return <Error error={error} />;
  if (loading)
    return (
      <Loader active inline>
        Deleting video...
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
        Delete
      </Button>
      <Confirm
        size="large"
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={onConfirmDelete}
        cancelButton="Cancel"
        confirmButton="Confirm"
        content={`Are you sure you want to permanently remove video titled: "${title}"?`}
        header="Warning!"
      />
    </>
  );
};

VideoDeleteButton.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  contentLanguage: PropTypes.array.isRequired,
  audioId: PropTypes.string,
  redirect: PropTypes.bool,
};

VideoDeleteButton.defaultProps = {
  audioId: null,
  redirect: false,
};

export default VideoDeleteButton;
