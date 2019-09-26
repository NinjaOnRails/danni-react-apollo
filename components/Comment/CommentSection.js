import React from 'react';
import { Comment, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import CommentSectionStyles from '../styles/Commentstyles';
import Error from '../UI/ErrorMessage';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import CommentList from './CommentList';
import { user } from '../UI/ContentLanguage';
import CommentForm from './CommentForm';
/* eslint-disable */
const videoComments = ({ videoId, render }) => (
  <Query query={VIDEO_COMMENTS_QUERY} variables={{ video: videoId }}>
    {render}
  </Query>
);
/* eslint-enable */

const Composed = adopt({
  user,
  videoComments,
});

class CommentSection extends React.Component {
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   const { videoId, client } = this.props;
  //   if (videoId === nextProps.videoId || client === nextProps.client) {
  //     return false;
  //   }
  //   return true;
  // }

  renderComments = (data, currentUser) => {
    const { videoId, client } = this.props;
    return (
      <CommentSectionStyles>
        <Comment.Group size="large">
          <CommentForm
            videoId={videoId}
            client={client}
            hideSigninToComment={data.hideSigninToComment}
          />
          {data.comments.length > 0 && (
            <CommentList
              comments={data.comments}
              videoId={videoId}
              client={client}
              currentUser={currentUser}
            />
          )}
        </Comment.Group>
      </CommentSectionStyles>
    );
  };

  render() {
    const { videoId } = this.props;
    return (
      <Composed videoId={videoId}>
        {({
          user: { currentUser },
          videoComments: {
            error: commentsLoadingError,
            loading: commentsLoading,
            data,
          },
        }) => (
          <>
            <Error error={commentsLoadingError} />
            {commentsLoading ? (
              <Loader active inline="centered" />
            ) : (
              this.renderComments(data, currentUser)
            )}
          </>
        )}
      </Composed>
    );
  }
}

CommentSection.propTypes = {
  videoId: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
};
export default CommentSection;
