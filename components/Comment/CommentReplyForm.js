import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import PleaseSignIn from '../Authentication/PleaseSignIn';
import Error from '../UI/ErrorMessage';
import { CREATE_COMMENTREPLY_MUTATION } from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';

/* eslint-disable */

const createCommentReplyMutation = ({ id, replyInput, videoId, render }) => (
  <Mutation
    mutation={CREATE_COMMENTREPLY_MUTATION}
    variables={{ comment: id, text: replyInput }}
    refetchQueries={[
      { query: VIDEO_COMMENTS_QUERY, variables: { video: videoId } },
    ]}
  >
    {(createCommentReply, createCommentReplyResult) => {
      return render({ createCommentReply, createCommentReplyResult });
    }}
  </Mutation>
);


/* eslint-enable */

const Composed = adopt({
  createCommentReplyMutation,
});

class CommentReplyForm extends React.Component {
  state = {
    replyFormValid: false,
    replyInput: '',
  };

  onTextChange = e => {
    const { value, name } = e.target;
    const form =
      name === 'updateInput' ? 'updateCommentFormValid' : 'replyFormValid';

    this.setState({ [name]: value, [form]: value.length > 0 });
  };

  onReplySubmit = async createCommentReply => {
    const { closeReplyInput } = this.props;
    const { data } = await createCommentReply();
    if (data) {
      this.setState({
        replyInput: '',
        replyFormValid: false,
      });
      closeReplyInput();
    }
  };

  renderReplyForm = ({
    createCommentReply,
    createCommentReplyResult: {
      error: createCommentReplyError,
      loading: createReplyLoading,
    },
  }) => {
    const { replyFormValid, replyInput } = this.state;
    const { showReplyInput } = this.props;
    return (
      <PleaseSignIn action="Reply" minimalistic hidden={!showReplyInput}>
        <Form
          loading={createReplyLoading}
          reply
          onSubmit={() => {
            this.onReplySubmit(createCommentReply);
          }}
          autoComplete="off"
        >
          <Form.Input
            name="replyInput"
            placeholder="Viết trả lời..."
            onChange={this.onTextChange}
            value={replyInput}
            autoComplete="off"
          />
          <Error error={createCommentReplyError} />
          <Button content="Đăng" primary disabled={!replyFormValid} />
        </Form>
      </PleaseSignIn>
    );
  };

  render() {
    const { replyInput } = this.state;
    const { id, videoId } = this.props;
    return (
      <Composed replyInput={replyInput} id={id} videoId={videoId}>
        {({ createCommentReplyMutation }) => {
          return this.renderReplyForm(createCommentReplyMutation);
        }}
      </Composed>
    );
  }
}

CommentReplyForm.propTypes = {
  id: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  showReplyInput: PropTypes.bool.isRequired,
  closeReplyInput: PropTypes.func.isRequired,
};

export default CommentReplyForm;
