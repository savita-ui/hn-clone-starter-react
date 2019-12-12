import React from "react";
import Header from "./Header";
import List from "./List";
import { getNewStories } from "../service/hnservice";
import { Wrapper,Page, Interactions, MoreLink } from "../styles/StoryStyles";

const applyUpdateResult = result => prevState => ({
  hits: [...prevState.hits, ...result.data.hits],
  page: result.page
});

const applySetResult = result => prevState => ({
  hits: result.data.hits,
  page: result.data.page
});

class NewStories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      page: null
    };
  }

  onInitialSearch = e => {
    e.preventDefault();
    const { value } = this.input;
    if (value === "") {
      return;
    }
    this.fetchStories(value, 0);
  };
  onPaginatedSearch = e =>
    this.fetchStories(this.input.value, this.state.page + 1);

  fetchStories = (value, page) =>
    getNewStories(value, page).then(result => this.onSetResult(result, page));

  onSetResult = (result, page) =>
    page === 0
      ? this.setState(applySetResult(result))
      : this.setState(applyUpdateResult(result));

  handleProductUpVote = objectId => {
    const nextFeeds = this.state.hits.map(feed => {
      return feed.objectID === objectId
        ? { ...feed, points: feed.points + 1 }
        : feed;
    });
    this.setState({ hits: nextFeeds });
  };
  Hide = id => {
    const list = this.state.hits.filter(el => el.objectID !== id);

    this.setState({ hits: list });
  }; // end of toggle

  render() {
    return (
      <Page>
        <Interactions>
          <form type="submit" onSubmit={this.onInitialSearch}>
            <input type="text" ref={node => (this.input = node)} />
            <button type="submit">Search</button>
          </form>
        </Interactions>
        {this.state.hits.length > 0 ? <Header /> : null}
        <Wrapper>
          {this.state.hits.map((item, index) => (
            <List
              handleProductUpVote={this.handleProductUpVote}
              hideFeed={this.Hide}
              objectID={item.objectID}
              isOdd={index % 2}
              item={item}
            />
          ))}
          <div>
            {this.state.page !== null && (
              <MoreLink href="#" onClick={this.onPaginatedSearch}>
                More
              </MoreLink>
            )}
          </div>
        </Wrapper>
      </Page>
    );
  }
}

export default NewStories;