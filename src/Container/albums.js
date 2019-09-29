import React from "react";
import axios from "axios";
import {LazyLoadImage} from 'react-lazy-load-image-component';
// import { Carousel } from "react-responsive-carousel";
import $ from 'jquery';

import { CircularProgress } from "@material-ui/core/";
import {
  ArrowBackIos,
  ArrowForwardIos
} from '@material-ui/icons'
import classes from "./albums.module.css";

class App extends React.Component {
  state = {
    albums: []
  };

  componentDidMount() {
    let urlArray = [];
    let fResponse = [];
    axios
      .get("https://jsonplaceholder.typicode.com/albums")
      .then(async response => {
        fResponse = response.data;
        response.data.forEach(element => {
          urlArray.push(
            axios.get(
              `https://jsonplaceholder.typicode.com/photos?albumId=${
                element.id
              }`
            )
          );
        });
        return axios.all(urlArray);
      })
      .then(el => {
        fResponse.forEach((val, i) => {
          fResponse[i].albums = el.filter(v => {
            if (val.id === parseFloat(v.config.url.split("=")[1]))
              return v.data;
          })[0].data;
        });
        this.setState({ albums: fResponse });
      });
  }

  scroll (direction, el) {
    if (direction === -1) {
      let far =
        $ (el.currentTarget.nextElementSibling).width () / 2 * direction;
      let pos = $ (el.currentTarget.nextElementSibling).scrollLeft () + far;
      $ (el.currentTarget.nextElementSibling).animate ({scrollLeft: pos}, 1000);
    } else {
      let far =
        $ (el.currentTarget.previousElementSibling).width () / 2 * direction;
      let pos = $ (el.currentTarget.previousElementSibling).scrollLeft () + far;
      $ (el.currentTarget.previousElementSibling).animate (
        {scrollLeft: pos},
        1000
      );
    }
  }

  render() {
    return (
      <div style={{ backgroundColor: "#eee" }}>
        {this.state.albums.length > 0 ? (
          this.state.albums.map((album, i) => (
            <div key={i} className={classes.individualBlock}>
              <div className={classes.header}>
                <div>{album.title}</div>
                <div>
                  <span>id:{album.id}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span>userId:{album.userId}</span>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <span
                  onClick={this.scroll.bind (null, -1)}
                  className={classes.sliderLeftBtn}
                >
                  <ArrowBackIos style={{ marginLeft: '10px' }} />
                </span>
                <div className={classes.img_container}> 
                {album && album.albums && album.albums.map((val, index) => (
                      <div
                        key={index + i}
                        className={classes.img_container_block}
                      >
                        {val.url ? (
                          <LazyLoadImage
                            alt={val.thumbnailUrl}
                            placeholderSrc={require ('../logo.svg')}
                            height={'100%'}
                            width={'100%'}
                            effect="blur"
                            src={val.url}
                            delayTime={800}
                          />
                        ) : null}
                        <p className={classes.content_img}>
                          <span>Title:&nbsp;{val.title}</span>
                          <span>id:&nbsp;{val.id}</span>
                        </p>
                      </div>
                  ))}
                </div>
                  <span
                    onClick={this.scroll.bind (null, 1)}
                    className={classes.sliderRightBtn}
                  >
                   <ArrowForwardIos />
                  </span>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              height: '100vh',
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

export default App;
