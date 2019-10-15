import { Icon, Item, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const UserInfo = ({
  user: { displayName, name, bio, email, location },
  userId,
  currentUser,
  onUserInfoEditClick,
  uploadsTotal,
  me,
}) => {
  const isOwner = currentUser && currentUser.id === userId;
  return (
    <Item.Content verticalAlign="middle">
      <Item.Header>
        {displayName}{' '}
        {isOwner && (
          <Popup
            trigger={<Icon link name="write" onClick={onUserInfoEditClick} />}
            content="Sửa thông tin cá nhân"
          />
        )}
      </Item.Header>
      {uploadsTotal !== 0 && (
        <Item.Meta>
          <Icon name="video" /> {uploadsTotal} Uploads
        </Item.Meta>
      )}
      {name && name !== displayName && (
        <Item.Description>
          <p>
            {me && (
              <Popup
                content={currentUser.showName ? 'Hiển thị' : 'Giấu'}
                trigger={
                  <Icon name={currentUser.showName ? 'eye' : 'eye slash'} />
                }
              />
            )}
            {name}
          </p>
          {bio && (
            <p>
              {me && (
                <Popup
                  content={currentUser.showBio ? 'Hiển thị' : 'Giấu'}
                  trigger={
                    <Icon name={currentUser.showBio ? 'eye' : 'eye slash'} />
                  }
                />
              )}
              {bio}
            </p>
          )}
        </Item.Description>
      )}
      <Item.Extra>
        {location && (
          <p>
            {me && (
              <Popup
                content={currentUser.showLocation ? 'Hiển thị' : 'Giấu'}
                trigger={
                  <Icon name={currentUser.showLocation ? 'eye' : 'eye slash'} />
                }
              />
            )}
            {location}
          </p>
        )}
        {email && (
          <p>
            {me && (
              <Popup
                content={currentUser.showEmail ? 'Hiển thị' : 'Giấu'}
                trigger={
                  <Icon name={currentUser.showEmail ? 'eye' : 'eye slash'} />
                }
              />
            )}
            {email}
          </p>
        )}
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
  me: PropTypes.bool,
};

UserInfo.defaultProps = {
  currentUser: null,
  uploadsTotal: 0,
  me: false,
};

export default UserInfo;
