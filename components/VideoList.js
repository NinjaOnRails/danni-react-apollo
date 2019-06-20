import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import { Query } from 'react-apollo';
import { List, Image, Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import { ALL_VIDEOS_QUERY } from './Videos';
import Error from './ErrorMessage';

const VideoItem = styled.div`
  display: flex !important;
  align-items: center !important;
  cursor: pointer;

  .content {
    padding: 0 0 0 0.5em;
  }

  img.ui.image {
    max-width: 180px;
  }
`;

class VideoList extends Component {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      router: {
        query: { id },
      },
    } = this.props;
    return (
      <Query query={ALL_VIDEOS_QUERY}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Dimmer active>
                <Loader />
              </Dimmer>
            );
          if (error) return <Error>Error: {error.message}</Error>;
          return (
            <List divided relaxed>
              {data.videos.map(
                video =>
                  video.id !== id && (
                    <List.Item
                      key={video.id}
                      onClick={() =>
                        Router.push({
                          pathname: '/watch',
                          query: { id: video.id },
                        })
                      }
                    >
                      <VideoItem>
                        <Image
                          src={video.originThumbnailUrl}
                          alt={video.titleVi}
                        />
                        <List.Content>
                          <List.Header>{video.titleVi}</List.Header>
                        </List.Content>
                      </VideoItem>
                    </List.Item>
                  )
              )}
            </List>
          );
        }}
      </Query>
    );
  }
}

VideoList.propTypes = {
  router: propTypes.object.isRequired,
};

export default withRouter(VideoList);
