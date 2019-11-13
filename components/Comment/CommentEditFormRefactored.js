import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';

class CommentUpdateForm extends React.Component {
  state = {
    updateCommentFormValid: true,
  };

  onCommentUpdate = async updateComment => {
    const { closeEditInput } = this.props;
    const { data } = await updateComment();
    if (data) {
      closeEditInput();
    }
  };

  onChange = ({ target: { value } }) => {
    this.setState({
      text: value,
      updateCommentFormValid: value.length > 0,
    });
  };

  render() {
    const { text, updateCommentFormValid } = this.state;
    const {
      id,
      videoId,
      defaultText,
      closeEditInput,
      commentType,
    } = this.props;

    return (
      <Composed text={text} id={id} videoId={videoId}>
        {({
          updateCommentMutation: {
            updateComment,
            updateCommentResult: {
              error: updateCommentError,
              loading: updateCommentLoading,
            },
          },
          updateCommentReplyMutation: {
            updateCommentReply,
            updateCommentReplyResult: {
              error: updateCommentReplyError,
              loading: updateCommentReplyLoading,
            },
          },
        }) => (
          <Form
            autoComplete="off"
            loading={updateCommentLoading || updateCommentReplyLoading}
            reply
            onSubmit={() => {
              if (commentType === 'comment') {
                this.onCommentUpdate(updateComment);
              } else if (commentType === 'commentReply') {
                this.onCommentUpdate(updateCommentReply);
              }
            }}
          >
            <Form.Input
              name="updateInput"
              onChange={this.onChange}
              defaultValue={defaultText}
              autoComplete="off"
            />
            <Button
              content="Sửa bình luận"
              primary
              disabled={!updateCommentFormValid}
            />
            <Button content="Huỷ" onClick={closeEditInput} />
            <Error error={updateCommentError || updateCommentReplyError} />
          </Form>
        )}
      </Composed>
    );
  }
}

CommentUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  closeEditInput: PropTypes.func.isRequired,
  defaultText: PropTypes.string.isRequired,
  commentType: PropTypes.string.isRequired,
};

export default CommentUpdateForm;
