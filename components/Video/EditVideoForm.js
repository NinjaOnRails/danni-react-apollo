import React from 'react';
import { Dropdown, Loader, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { flagOptions } from '../../lib/supportedLanguages';
import DropDownForm from '../styles/VideoFormStyles';
import CloudinaryUpload from './CloudinaryUpload';

const EditVideoForm = ({
  oldTitleVi,
  oldDescriptionVi,
  oldDefaultVolume,
  oldOriginId,
  oldTags,
  oldAudioSource,
  oldLanguage,
  oldAuthor,
  loadingUpdateVideo,
  loadingCreateAudio,
  loadingUpdateAudio,
  handleChange,
  handleDropdown,
  // passed state
  isDescription,
  isAudioSource,
  isTags,
  isDefaultVolume,
  image,
  originTitle,
  channelTitle,
  youtubeIdStatus,
  fetchingYoutube,
}) => (
  <fieldset
    disabled={loadingUpdateVideo || loadingCreateAudio || loadingUpdateAudio}
    aria-busy={loadingUpdateVideo}
  >
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
    {originTitle && (
      <Segment>
        <p>{originTitle}</p>
        <p>{channelTitle}</p>
        {image && <img width="200" src={image} alt="thumbnail" />}
      </Segment>
    )}
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
        <Segment>
          <p>Current YouTube tags:</p>
          {oldTags}
        </Segment>
      </>
    )}
    <label htmlFor="audioSource">
      <input
        id="audioSource"
        name="isAudioSource"
        type="checkbox"
        checked={isAudioSource}
        onChange={handleChange}
      />
      Nguồn Audio:
    </label>
    {isAudioSource && (
      <>
        {/* <CloudinaryUpload
          onUploadFileSubmit={onUploadFileSubmit}
          source={youtubeId}
          language={language}
          uploadProgress={uploadProgress}
          uploadError={uploadError}
          deleteToken={deleteToken}
          onDeleteFileSubmit={onDeleteFileSubmit}
          secureUrl={secureUrl}
          handleChange={handleChange}
          audioSource={audioSource}
          onAudioLoadedMetadata={onAudioLoadedMetadata}
        /> */}
        <input
          type="text"
          name="audioSource"
          defaultValue={oldAudioSource}
          onChange={handleChange}
        />
        Người đọc:
        <input
          type="text"
          name="audioAuthor"
          defaultValue={oldAuthor}
          onChange={handleChange}
        />
        Language:
        <DropDownForm>
          <Dropdown
            fluid
            selection
            options={flagOptions}
            onChange={handleDropdown}
            defaultValue={oldLanguage || ''}
            name="audioLanguage"
            className="semantic-dropdown"
          />
        </DropDownForm>
      </>
    )}
    <button type="submit">Save Changes</button>
  </fieldset>
);

EditVideoForm.defaultProps = {
  oldLanguage: null,
};

EditVideoForm.propTypes = {
  // props from state
  isDescription: PropTypes.bool.isRequired,
  isTags: PropTypes.bool.isRequired,
  isDefaultVolume: PropTypes.bool.isRequired,
  isAudioSource: PropTypes.bool.isRequired,
  fetchingYoutube: PropTypes.bool.isRequired,
  youtubeIdStatus: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  channelTitle: PropTypes.string.isRequired,
  originTitle: PropTypes.string.isRequired,
  // default values
  oldTitleVi: PropTypes.string.isRequired,
  oldDescriptionVi: PropTypes.string.isRequired,
  oldDefaultVolume: PropTypes.number.isRequired,
  oldOriginId: PropTypes.string.isRequired,
  oldTags: PropTypes.string.isRequired,
  oldAudioSource: PropTypes.string.isRequired,
  oldAuthor: PropTypes.string.isRequired,
  oldLanguage: PropTypes.string,
  // loading status
  loadingUpdateAudio: PropTypes.bool.isRequired,
  loadingCreateAudio: PropTypes.bool.isRequired,
  loadingUpdateVideo: PropTypes.bool.isRequired,
  // passsed down methods
  handleChange: PropTypes.func.isRequired,
  handleDropdown: PropTypes.func.isRequired,
};

export default EditVideoForm;
