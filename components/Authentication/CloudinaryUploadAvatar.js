import React, { Component } from 'react';
import { Query } from 'react-apollo';
import {
  Loader,
  Progress,
  Button,
  Icon,
  Image,
  Input,
  Header,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import axios from 'axios';
import Error from '../UI/ErrorMessage';
import { CLOUDINARY_AUTH_AVATAR } from '../../graphql/query';
import { user } from '../UI/ContentLanguage';
import { uploadAvatar } from '../../lib/cloudinaryUpload';
import deleteFile from '../../lib/cloudinaryDeleteFile';

const cloudinaryAuthAvatar = ({ render }) => (
  <Query query={CLOUDINARY_AUTH_AVATAR}>{render}</Query>
);

const Composed = adopt({
  cloudinaryAuthAvatar,
  user,
});

class CloudinaryUploadAudio extends Component {
  state = {
    startingUpload: false,
    uploadError: false,
    uploadProgress: 0,
    secureUrl: '',
    deleteToken: '',
    uploadImageUrl: '',
  };

  handleChange = ({ target: { name, value } }) => {
    // Controlled set state
    this.setState({ [name]: value });
  };

  onUploadFileSubmit = async (cloudinaryAuthAvatar, id, e) => {
    const { setSecureUrl, chooseUpload } = this.props;
    // Reset uploadError display and assign appropriate value to file
    this.setState({ uploadError: false });
    const { deleteToken, uploadImageUrl } = this.state;
    const file = e ? e.target.files[0] : uploadImageUrl;

    if (!file) return; // Do nothing if no file selected

    if (deleteToken) await this.onDeleteFileSubmit();

    // More initial state reset
    this.setState({
      uploadProgress: 0,
      deleteToken: '',
      secureUrl: '',
    });

    // Prepare cloudinary upload params
    const { url, data } = uploadAvatar(file, id, cloudinaryAuthAvatar);

    // Upload file with post request
    try {
      const {
        data: { secure_url: secureUrl, delete_token: newDeleteToken },
      } = await axios({
        method: 'post',
        url,
        data,
        onUploadProgress: p => {
          // Show upload progress
          this.setState({
            uploadProgress: Math.floor((p.loaded / p.total) * 100),
          });
        },
      });
      chooseUpload();
      setSecureUrl(secureUrl, newDeleteToken);
      this.setState({
        secureUrl,
        deleteToken: newDeleteToken,
      });
    } catch {
      this.setState({
        uploadError: true,
      });
    }
  };

  onDeleteFileSubmit = async () => {
    const { deleteToken } = this.state;
    this.setState({
      uploadProgress: 0,
      secureUrl: '',
    });

    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      this.setState({
        deleteToken: '',
      });
    }
  };

  render() {
    const {
      uploadProgress,
      uploadError,
      secureUrl,
      startingUpload,
    } = this.state;
    const { chooseUpload } = this.props;
    return (
      <Composed>
        {({
          cloudinaryAuthAvatar: { loading, error, data },
          user: { currentUser, loading: loadingUser },
        }) => {
          if (loading || loadingUser)
            return <Loader inline="centered" active />;
          if (error) return <Error>Error: {error.message}</Error>;
          const { id } = currentUser;

          return (
            <Segment
              attached
              loading={
                startingUpload &&
                !uploadError &&
                !(uploadProgress > 0 && uploadProgress < 100)
              }
            >
              {(!uploadError && uploadProgress > 0 && uploadProgress < 100 && (
                <Progress percent={uploadProgress} progress success />
              )) ||
                (secureUrl && (
                  <>
                    <Header as="h3">Ảnh được tải lên:</Header>
                    <Button
                      negative
                      onClick={this.onDeleteFileSubmit}
                      type="button"
                    >
                      Xoá
                    </Button>
                    <Image src={secureUrl} />
                  </>
                )) || (
                  <>
                    {uploadError && (
                      <Progress percent={100} error>
                        Lỗi mạng hoặc ảnh có vấn đề. Vui lòng thử sau.
                      </Progress>
                    )}
                    <Header as="h3">Chọn ảnh trong máy:</Header>
                    <Input
                      onClick={() => chooseUpload()}
                      type="file"
                      id="file"
                      name="file"
                      accept=".jpg,.png"
                      onChange={async e => {
                        this.setState({ startingUpload: true });
                        await this.onUploadFileSubmit(
                          data.cloudinaryAuthAvatar,
                          id,
                          e
                        );
                        this.setState({ startingUpload: false });
                      }}
                    />
                    <Header as="h3">Tải từ đường link:</Header>
                    <div className="uploadImageUrl">
                      <Input
                        onClick={() => chooseUpload()}
                        label="URL"
                        placeholder="file.jpg"
                        type="text"
                        id="uploadImageUrl"
                        name="uploadImageUrl"
                        onChange={this.handleChange}
                      />
                      <Button
                        positive
                        onClick={async () => {
                          this.setState({ startingUpload: true });
                          await this.onUploadFileSubmit(
                            data.cloudinaryAuthAvatar,
                            id
                          );
                          this.setState({ startingUpload: false });
                        }}
                      >
                        <Icon name="upload" />
                        Tải lên
                      </Button>
                    </div>
                  </>
                )}
            </Segment>
          );
        }}
      </Composed>
    );
  }
}

CloudinaryUploadAudio.propTypes = {
  setSecureUrl: PropTypes.func.isRequired,
  chooseUpload: PropTypes.func.isRequired,
};

export default CloudinaryUploadAudio;