import { Icon, Item } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const UserInfo = ({
  user: { displayName, name, bio, email, location },
  userId,
  currentUser,
  onUserInfoEditClick,
  uploadsTotal,
}) => {
  return (
    <Item.Content verticalAlign="middle">
      <Item.Header>
        {displayName}{' '}
        {currentUser && currentUser.id === userId && (
          <Icon link name="write" onClick={onUserInfoEditClick} />
        )}
      </Item.Header>
      {uploadsTotal !== 0 && (
        <Item.Meta>
          <Icon name="video" /> {uploadsTotal} Uploads
        </Item.Meta>
      )}
      {name !== displayName && (
        <Item.Description>
          <p>{name}</p>
        </Item.Description>
      )}
      <Item.Extra>
        <p>{bio}</p>
        <p>{location}</p>
        <p>{email}</p>
      </Item.Extra>
    </Item.Content>
  );
};

UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  onUserInfoEditClick: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  uploadsTotal: PropTypes.number,
};

UserInfo.defaultProps = {
  currentUser: null,
  uploadsTotal: 0,
};

export default UserInfo;
