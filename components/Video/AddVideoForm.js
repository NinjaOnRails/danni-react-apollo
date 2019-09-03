import React from 'react';
import { Dropdown, Loader, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import CloudinaryUpload from './CloudinaryUpload';
import { flagOptions, defaultLanguage } from '../../lib/supportedLanguages';
import DropDownForm from '../styles/VideoFormStyles';

const AddVideoForm = ({
  source,
  fetchingYoutube,
  youtubeIdStatus,
  originTitle,
  image,
  channelTitle,
  youtubeId,
  isAudioSource,
  language,
  secureUrl,
  uploadProgress,
  uploadError,
  deleteToken,
  audioSource,
  title,
  isDescription,
  description,
  isTags,
  originTags,
  tags,
  isDefaultVolume,
  defaultVolume,
  loadingCreateAudio,
  loadingCreateVideo,
  handleDropdown,
  handleChange,
  onUploadFileSubmit,
  onDeleteFileSubmit,
  onAudioLoadedMetadata,
}) => {
  return (
    <fieldset
      disabled={loadingCreateVideo || loadingCreateAudio}
      aria-busy={loadingCreateVideo}
    >
      Language:
      <DropDownForm>
        <Dropdown
          fluid
          selection
          options={flagOptions}
          onChange={handleDropdown}
          defaultValue={defaultLanguage}
          name="language"
          className="semantic-dropdown"
        />
      </DropDownForm>
      <label htmlFor="source">
        YouTube Source (ID or Link):
        <input
          type="text"
          id="source"
          name="source"
          required
          value={source}
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
      {youtubeId && (
        <>
          <label htmlFor="isAudioSource">
            <input
              id="isAudioSource"
              name="isAudioSource"
              type="checkbox"
              checked={isAudioSource}
              onChange={handleChange}
            />
            Upload Separate Audio File
          </label>
          {isAudioSource && (
            <>
              <CloudinaryUpload
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
              />
              <label htmlFor="title">
                Title:
                <input
                  type="text"
                  id="title"
                  name="title"
                  maxLength="100"
                  required
                  value={title}
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
                Description:
              </label>
              {isDescription && (
                <label htmlFor="description">
                  <textarea
                    name="description"
                    maxLength="5000"
                    rows="10"
                    value={description}
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
                    value={tags}
                    onChange={handleChange}
                  />
                  <Segment>
                    <p>Current YouTube tags:</p>
                    {originTags.join(' ')}
                  </Segment>
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
                Default YouTube Volume (%):
              </label>
              {isDefaultVolume && (
                <input
                  type="number"
                  name="defaultVolume"
                  min="0"
                  max="100"
                  value={defaultVolume}
                  onChange={handleChange}
                />
              )}
            </>
          )}
        </>
      )}
      <button type="submit">
        Submit{(loadingCreateVideo || loadingCreateAudio) && 'ting'}
      </button>
    </fieldset>
  );
};

AddVideoForm.propTypes = {
  source: PropTypes.string.isRequired,
  fetchingYoutube: PropTypes.bool.isRequired,
  youtubeIdStatus: PropTypes.string.isRequired,
  originTitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  channelTitle: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  isAudioSource: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  secureUrl: PropTypes.string.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  uploadError: PropTypes.bool.isRequired,
  deleteToken: PropTypes.string.isRequired,
  audioSource: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isDescription: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  isTags: PropTypes.bool.isRequired,
  originTags: PropTypes.array.isRequired,
  tags: PropTypes.string.isRequired,
  isDefaultVolume: PropTypes.bool.isRequired,
  defaultVolume: PropTypes.number.isRequired,
  loadingCreateAudio: PropTypes.bool.isRequired,
  loadingCreateVideo: PropTypes.bool.isRequired,
  handleDropdown: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  onUploadFileSubmit: PropTypes.func.isRequired,
  onDeleteFileSubmit: PropTypes.func.isRequired,
  onAudioLoadedMetadata: PropTypes.func.isRequired,
};

export default AddVideoForm;
