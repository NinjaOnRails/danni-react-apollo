import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

export const SEARCH_VIDEOS_QUERY = gql`
  query SEARCH_VIDEOS_QUERY($searchTerm: String!) {
    videos(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { originId_contains: $searchTerm }
          { originTitle_contains: $searchTerm }
          { originAuthor_contains: $searchTerm }
          { tags_some: { text_contains: $searchTerm } }
        ]
      }
    ) {
      id
      title
      originTitle
      originThumbnailUrl
    }
  }
`;

export function routetoItem(video) {
  Router.push({
    pathname: '/watch',
    query: {
      id: video.id,
    },
  });
}

class Autocomplete extends Component {
  state = {
    videos: [],
    loading: false,
  };

  onChange = debounce(async (e, client) => {
    if (e.target.value) {
      this.setState({ loading: true });
      const res = await client.query({
        query: SEARCH_VIDEOS_QUERY,
        variables: { searchTerm: e.target.value.toLowerCase() },
      });
      if (!res) {
        return this.setState({ videos: [], loading: false });
      }
      return this.setState({
        videos: res.data.videos,
        loading: false,
      });
    }
    return this.setState({ videos: [], loading: true });
  }, 350);

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          onChange={routetoItem}
          itemToString={video => (video === null ? '' : video.titleVi)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.videos.map((item, index) => (
                    <DropDownItem
                      key={item.id}
                      {...getItemProps({ item })}
                      highlighted={index === highlightedIndex}
                    >
                      <img
                        width='50'
                        src={item.originThumbnailUrl}
                        alt={item.titleVi}
                      />
                      {item.titleVi}
                    </DropDownItem>
                  ))}
                  {!this.state.videos.length && !this.state.loading && (
                    <DropDownItem>
                      Nothing Found For "{inputValue}"
                    </DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default Autocomplete;
