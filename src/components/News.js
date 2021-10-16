import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 9,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0
    };

    document.title = `NewsMonkey Class - ${this.capitalizeFirstLetter(
      this.props.category
    )}`;
  }

  async updateNews() {
    this.props.setProgress(40)
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    //this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.props.setProgress(50)
    //console.log(parsedData)
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100)
  }

  // fetchMoreData = async () =>{
  //   this.setState({page: this.state.page + 1})
  //   const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
  //   //this.setState({ loading: true });
  //   let data = await fetch(url);
  //   let parsedData = await data.json();
  //   //console.log(parsedData)
  //   this.setState({
  //     articles: this.state.articles.concat(parsedData.articles),
  //    // totalResults: parsedData.totalResults
  //   });
  // }

  async componentDidMount() {
    // let url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true})
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // //console.log(parsedData)
    // this.setState({
    //   articles: parsedData.articles,
    //   totalResults: parsedData.totalResults,
    //   loading: false });

    this.updateNews();
  }


  handlePrevCLick = async () => {
    let url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true})
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData)
    this.setState({
      articles: parsedData.articles,
      page: this.state.page - 1,
      loading:false
    });
    this.setState({
      page: this.state.page - 1,
    });

    this.updateNews();
  };

  handleNextCLick = async () => {
    if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
      let url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true})
      let data = await fetch(url);
      let parsedData = await data.json();
      //console.log(parsedData)
      this.setState({
        articles: parsedData.articles,
        page: this.state.page + 1,
      //  author: parsedData.author,
       // date: parsedData.publishedAt,
        loading: false
      });
    }
    this.setState({
      page: this.state.page + 1,
    });
    this.updateNews();
  };

  render() {
    return (
      <>
        <h1 className="my-3 text-center text-dark">
          NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines
        </h1>
        {/* this spinner is for first time loading */}
        {this.state.loading && <Spinner/>}   
        {/* <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        > */}
          <div className="container">
          <div className="row">
            {/* iterate articles */}
            {/* {!this.state.loading && */}
              {this.state.articles.map((article) => (
                <div className="col-md-4" key={article.url}>
                  {/* <NewsItem title={article.title?article.title.slice(0,45):""} description={article.description?article.description.slice(0,80):""} imageUrl={article.urlToImage} newsUrl={article.url} /> */}

                  <NewsItem
                    title={article.title ? article.title : ""}
                    description={article.description ? article.description : ""}
                    imageUrl={article.urlToImage}
                    newsUrl={article.url}
                    date={article.publishedAt}
                    author={article.author}
                    source={article.source.name}
                  />
                </div>
              ))}
          </div>
          </div>
        {/* </InfiniteScroll> */}

                {/* replaced with infinite scroll */}
            <div className="container d-flex justify-content-between">
              <button
                type="button"
                disabled={this.state.page <= 1}
                className="btn btn-dark"
                onClick={this.handlePrevCLick}
              >
                &larr; Previous
              </button>
              <button
                type="button"
                disabled={
                  this.state.page + 1 >
                  Math.ceil(this.state.totalResults / this.props.pageSize)
                }
                className="btn btn-dark"
                onClick={this.handleNextCLick}
              >
                Next &rarr;
              </button>
            </div>
      </>
    );
  }
}

export default News;
