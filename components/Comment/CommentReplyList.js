import React from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';

import CommentReply from './CommentReply';

class CommentReplyList extends React.Component {
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   const { reply } = this.props;
  //   if (reply === nextProps.reply) {
  //     return false;
  //   }
  //   return true;
  // }

  render() {
    const { reply, currentUser, onReplyClick } = this.props;
    return (
      <Comment.Group>
        {reply.map(commentReply => (
          <CommentReply
            key={commentReply.id}
            commentReply={commentReply}
            onReplyClick={onReplyClick}
            currentUser={currentUser}
          />
        ))}
      </Comment.Group>
    );
  }
}

CommentReplyList.propTypes = {
  reply: PropTypes.array.isRequired,
  onReplyClick: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

CommentReplyList.defaultProps = {
  currentUser: null,
};

export default CommentReplyList;
