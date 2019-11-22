import PropTypes from 'prop-types';
import { Dropdown, Loader, Segment, Message, Button } from 'semantic-ui-react';
import { flagOptions } from '../../lib/supportedLanguages';
import DropDownForm from '../styles/VideoFormStyles';
import CloudinaryUploadAudio from './CloudinaryUploadAudio';

const EditVideoForm = ({
  audioId,
  // default values
  oldValuesObject: {
    oldTitleVi,
    oldDescriptionVi,
    oldDefaultVolume,
    oldOriginId,
    oldTags,
    oldAudioSource,
    oldLanguage,
    oldImage,
    oldOriginTitle,
    oldOriginChannel,
    oldOriginTags,
  },
  // input state
  language,
  audioSource,
  // ui state
  uiState: {
    isDescription,
    isAudioSource,
    isTags,
    isDefaultVolume,
    showUpload,
    secureUrl,
    uploadProgress,
    uploadError,
    deleteToken,
    youtubeId,
    youtubeIdStatus,
    fetchingYoutube,
  },
  disabled,
  ariaBusy,
  // methods
  handleChange,
  handleDropdown,
  onUploadFileSubmit,
  onDeleteFileSubmit,
  onAudioLoadedMetadata,
  onShowUpload,
  // thumbnail
  image,
  originTitle,
  channelTitle,

  originTags,
}) => (
  <fieldset disabled={disabled} aria-busy={ariaBusy}>
    Language:
    <DropDownForm>
      <Dropdown
        fluid
        selection
        options={flagOptions}
        onChange={handleDropdown}
        defaultValue={oldLanguage}
        name="language"
        className="semantic-dropdown"
      />
    </DropDownForm>
    <label htmlFor="source">
      Nguồn (Link hoặc YouTube ID):
      <input
        type="text"
        id="source"
        name="source"
        required
        defaultValue={oldOriginId}
        onChange={handleChange}
      />
    </label>
    {fetchingYoutube && <Loader inline="centered" active />}
    {youtubeIdStatus && <div>{youtubeIdStatus}</div>}
    {(originTitle || oldOriginTitle) && (
      <Segment>
        <p>{originTitle || oldOriginTitle}</p>
        <p>{channelTitle || oldOriginChannel}</p>
        {(image || oldImage) && (
          <img width="200" src={image || oldImage} alt="thumbnail" />
        )}
      </Segment>
    )}
    {!audioId && (
      <label htmlFor="isAudioSource">
        <input
          id="isAudioSource"
          name="isAudioSource"
          type="checkbox"
          checked={audioId || isAudioSource}
          onChange={handleChange}
        />
        Upload Separate Audio File
      </label>
    )}
    {(audioId || isAudioSource) && (
      <>
        {!secureUrl && oldAudioSource && (
          <>
            <p>Current Audio:</p>
            <audio
              controls
              src={oldAudioSource}
              onLoadedMetadata={e => onAudioLoadedMetadata(e)}
            >
              <track kind="captions" />
            </audio>
          </>
        )}
        <p>Upload New Audio:</p>

        {(showUpload && (
          <CloudinaryUploadAudio
            onUploadFileSubmit={onUploadFileSubmit}
            source={youtubeId || oldOriginId}
            language={language || oldLanguage}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
            deleteToken={deleteToken}
            onDeleteFileSubmit={onDeleteFileSubmit}
            secureUrl={secureUrl}
            handleChange={handleChange}
            audioSource={audioSource}
            onAudioLoadedMetadata={onAudioLoadedMetadata}
          />
        )) || (
          <Message warning>
            <p>
              Uploading a new audio file will immediately permanently replace
              the old one.{' '}
              <Button onClick={() => onShowUpload()}>Continue</Button>
            </p>
          </Message>
        )}
        {(secureUrl || audioSource || audioId) && (
          <>
            <label htmlFor="title">
              Tiêu đề:
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength="100"
                defaultValue={oldTitleVi}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="description">
              <input
                id="description"
                name="isDescription"
                type="checkbox"
                checked={isDescription}
                onChange={handleChange}
              />
              Nội dung:
            </label>
            {isDescription && (
              <label htmlFor="description">
                <textarea
                  name="description"
                  maxLength="5000"
                  rows="10"
                  defaultValue={oldDescriptionVi}
                  onChange={handleChange}
                />
              </label>
            )}
            <label htmlFor="tags">
              <input
                id="tags"
                name="isTags"
                type="checkbox"
                checked={isTags}
                onChange={handleChange}
              />
              Tags:
            </label>
            {isTags && (
              <>
                <input
                  type="text"
                  name="tags"
                  maxLength="500"
                  defaultValue={oldTags.trim()}
                  onChange={handleChange}
                />
                {originTags && (
                  <Segment>
                    <p>Current YouTube tags:</p>
                    {originTags.join(' ') ||
                      oldOriginTags.reduce(
                        (tagString, tag) => tagString + ' ' + tag.text,
                        ' '
                      )}
                  </Segment>
                )}
              </>
            )}
            <label htmlFor="defaultVolume">
              <input
                id="defaultVolume"
                name="isDefaultVolume"
                type="checkbox"
                checked={isDefaultVolume}
                onChange={handleChange}
              />
              Âm lượng (%):
            </label>
            {isDefaultVolume && (
              <input
                type="number"
                name="defaultVolume"
                min="0"
                max="100"
                defaultValue={oldDefaultVolume}
                onChange={handleChange}
              />
            )}
          </>
        )}
      </>
    )}
    <button type="submit">Save Changes</button>
  </fieldset>
);

EditVideoForm.defaultProps = {
  oldLanguage: '',
  image: '',
  channelTitle: '',
  originTitle: '',
  // tags: '',
  originTags: [],
  language: '',
  audioSource: '',
  audioId: '',
  // isAudioSource: false,
};

EditVideoForm.propTypes = {
  audioId: PropTypes.string,
  // props from state
  uiState: PropTypes.object.isRequired,
  image: PropTypes.string,
  channelTitle: PropTypes.string,
  originTitle: PropTypes.string,
  // tags: PropTypes.string,
  originTags: PropTypes.array,
  language: PropTypes.string,
  audioSource: PropTypes.string,
  secureUrl: PropTypes.string.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  uploadError: PropTypes.bool.isRequired,
  deleteToken: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  // default values
  oldValuesObject: PropTypes.object.isRequired,
  // loading status
  disabled: PropTypes.bool.isRequired,
  ariaBusy: PropTypes.bool.isRequired,
  // passsed down methods
  handleChange: PropTypes.func.isRequired,
  handleDropdown: PropTypes.func.isRequired,
  onUploadFileSubmit: PropTypes.func.isRequired,
  onDeleteFileSubmit: PropTypes.func.isRequired,
  onAudioLoadedMetadata: PropTypes.func.isRequired,
  onShowUpload: PropTypes.func.isRequired,
};

export default EditVideoForm;

// 117       setUiState({ ...uiState, youtubeIdStatus: 'Invalid source' });
// 124     setUiState({ ...uiState, fetchYoutube: originId });
// 130       setUiState({ ...uiState, fetchingYoutube: true });
// 141 setUiState({
//   ...uiState,
//   youtubeIdStatus: 'Not found on Youtube',
//   fetchingYoutube: false,
// });
// 162  setUiState({
//   ...uiState,
//   youtubeIdStatus: '',
//   fetchingYoutube: false,
//   youtubeId: id,
// });
// 174 setUiState({
//   ...uiState,
//   fetchingYoutube: false,
//   youtubeIdStatus: false,
// });
// 187 setUiState({
//   ...uiState,
//   uploadError: false,
//   error: '',
// });
// 226 setUiState({
//   ...uiState,
//   uploadProgress: Math.floor((p.loaded / p.total) * 100),
// });
// 232 setUiState({
//   ...uiState,
//   deleteToken: newDeleteToken,
//   secureUrl,
// });
// 240  setUiState({
//   ...uiState,
//   uploadError: true,
// });
// 257  setUiState({
//   ...uiState,
//   deleteToken: '',
// });
// 265 setUiState({
//   ...uiState,
//   audioDuration: Math.round(e.target.duration),
// });