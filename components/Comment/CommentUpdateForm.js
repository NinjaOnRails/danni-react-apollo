import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { UPDATE_COMMENT_MUTATION } from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
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
      this.setState({
        updateInput: '',
      });
    }
  };

  onChange = e => {
    const { value, name } = e.target;
    const form =
      name === 'updateInput' ? 'updateCommentFormValid' : 'replyFormValid';

    this.setState({ [name]: value, [form]: value.length > 0 });
  };

  render() {
    const { updateInput, updateCommentFormValid } = this.state;
    const { id, videoId, defaultText, closeEditInput } = this.props;
    return (
      <Mutation
        mutation={UPDATE_COMMENT_MUTATION}
        variables={{ comment: id, text: updateInput }}
        refetchQueries={[
          {
            query: VIDEO_COMMENTS_QUERY,
            variables: { video: videoId },
          },
        ]}
      >
        {(updateComment, { loading, error }) => (
          <Form
            autoComplete="off"
            loading={loading}
            reply
            onSubmit={() => {
              this.onCommentUpdate(updateComment);
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
            <Error error={error} />
          </Form>
        )}
      </Mutation>
    );
  }
}

CommentUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  closeEditInput: PropTypes.func.isRequired,
  defaultText: PropTypes.string.isRequired,
};

export default CommentUpdateForm;
