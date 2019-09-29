import React, { Component } from 'react';
import Masonry from 'react-masonry-css';
import {API_KEY, API_URL_search} from './constants'

class SearchGifList extends Component {
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
          value: this.props.value
        };
      }

   
    searchGifs = () => {
      fetch( API_URL_search + 
      "?q=" + this.props.value +
      "&api_key=" + this.state.api_key + 
      "&limit=" +  this.state.limit +
      "&offset=" + this.state.offset)
          .then(res => res.json())
          .then(
            (result) => {
                this.setState({
                isLoaded: true,
                items: (this.state.items).concat(result.data),
                total_count: result.pagination.total_count,
                offset : this.state.offset + 20
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error : 'Somethings went wrong to search gifs.'
              });
            }
          )
    }

      componentDidMount() {
        this.setState({
          items: [],
          offset: 0
        })
        this.searchGifs();
      }

      componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {

          setTimeout(() => {
            this.setState({
            items: [],
            offset: 0
          }, function(){
            this.searchGifs();
            });
          }, 10)
          
        }
      }
    
      
      loadMore = () => {
        if(this.state.offset < this.state.total_count){
          this.searchGifs();
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
                <h1>{this.props.value} <span className="total-count">{this.state.total_count} GIFS</span> </h1>
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

                <div className="text-center">
                  <button className="load-more-btn" onClick={this.loadMore}>Load More</button>
                </div>
            </>
        );
        }
    }

}

export default SearchGifList;