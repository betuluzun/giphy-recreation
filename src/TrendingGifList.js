import React, { Component } from 'react';
import Masonry from 'react-masonry-css';
import {API_KEY, API_URL_trending} from './constants';

class TrendingGifList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
          breakpointColumnsObj : {
            default: 4,
            1100: 3,
            700: 2,
            500: 1
            },
            offset: 0,
            limit: 20,
            api_key: API_KEY,
            total_count: 0,

            height: window.innerHeight,
        };
      }

    getGifs = () => {
      fetch(API_URL_trending +  this.state.api_key + 
      "&limit=" +  this.state.limit +
      "&offset=" + this.state.offset)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: (this.state.items).concat(result.data),
                total_count: result.pagination.total_count,
              });
              
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error : 'Somethings went wrong to get gifs.'
              });
            }
          )
    }


      componentDidMount() {
        
        window.addEventListener("scroll", this.handleScroll);
        this.getGifs();  
      }
      componentWillUnmount() {
          window.removeEventListener("scroll", this.handleScroll);
      }
      
      loadMore = () => {
        if(this.state.offset < this.state.total_count){
          this.setState({
            offset : this.state.offset + 20
          });
        }
        this.getGifs();
      }

      handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset + 1;
        if (windowBottom >= docHeight) {
          this.loadMore();
        } 
        
    }


    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
        return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
        return <div className="loader-container"><img src="https://samherbert.net/svg-loaders/svg-loaders/grid.svg" alt="Loading" /></div>;
        } else {
        return (
            <>  
                <p className="trending-header">Trending GIFs</p>
                <Masonry
                breakpointCols={this.state.breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                >
                    {items.map(item => (
                        <div className="gif-container" >
                         <a href={item.url} target="_blank">
                             <img className="gif-preview" height={item.images.fixed_width.height} src={item.images.fixed_width.webp} alt={item.title} />
                          </a>
                        </div>
                        
                    ))}
                </Masonry>

            </>
        );
        }
    }

}

export default TrendingGifList;