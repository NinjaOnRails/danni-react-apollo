import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import { Search as SemanticSearch } from 'semantic-ui-react';
import { DropDown, DropDownItem } from '../../styles/DropDown';
import { SEARCH_VIDEOS_QUERY, routetoItem } from '../Search';
import { StyledMobileSearch } from '../../styles/MobileUiStyles';

class MobileSearch extends React.Component {
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
    const { videos, loading } = this.state;
    resetIdCounter();
    return (
      <StyledMobileSearch>
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
                  <SemanticSearch
                    loading={loading}
                    placeholder='Search...'
                    onSearchChange={e => {
                      e.persist();
                      this.onChange(e, client);
                    }}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {videos.map((item, index) => (
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
                  {!videos.length && !loading && (
                    <DropDownItem>
                      Nothing Found For "{inputValue}"
                    </DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </StyledMobileSearch>
    );
  }
}
export default MobileSearch;
