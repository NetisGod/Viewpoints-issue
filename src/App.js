import React, { Component } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash'
import { Jumbotron, Container, Row, Col, Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css'

import { Search, Grid as SemanticGrid, Loader, Message } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { FlyToInterpolator } from 'react-map-gl';

import './App.css'
import { NavBar } from './components/Header/NavBar'
import MapContainer from './components/Body/Map'
import List from './components/Body/List'
import FindViewpoint from './components/Body/FindViewpoint'
import Footer from './components/Footer/Footer'
import { groups } from './components/Body/groupsData'
import Home from './Home'

import history from './history';

import ListBreadcrumb from './components/Body/Breadcrumb'

import WebMercatorViewport from 'viewport-mercator-project';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchToHome: true,
      data: [],
      hasMore: true,
      isItemClicked: false,
      alertMessage: '',
      group: '',
      category: '',
      viewpoint: '',
      route: '',
      skip: 0,
      limit: 10,
      isLoading: false,
      turnOffInfiniteScroll: false,
      value: '',
      results: [],
      dataToFilterFromSearch: {},
      viewport: {
        latitude: 37.785164,
        longitude: -100,
        zoom: 3.5,
        // bearing: 0,
        // pitch: 0,
        width: 400,
        height: 400,
      },
      popupInfo: null,
      switchBtn: {
        isVisible: false,
        active: 'null'
      },
      userLocation: {
        latitude: null,
        longitude: null
      }
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({
      animatedClass: 'animated'
    }), 2000);

    window.addEventListener("resize", this.updateSwitchBtn);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSwitchBtn);
  }

  componentWillMount() {
    this.updateSwitchBtn();

    const path = this.props.match;

    this.createRoute(path);
    this.filterData(path.params)
      .then(() => {

        if (this.state.group && this.state.data.length) {
          const centerOnMarkers = this.centerOnMarkers(this.state.data);
          let center;

          const config = {
            ...this.state.viewport,
            latitude: centerOnMarkers.latitudeCenter,
            longitude: centerOnMarkers.longitudeCenter,
            zoom: centerOnMarkers.zoom,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1000
          };

          this.updataViewport(config);
        } else if (path.params.coordinatesCenter) {
          const coordinatesCenter = path.params.coordinatesCenter.split(';'),
            center = [+coordinatesCenter[1], +coordinatesCenter[0]];

          const { longitude, latitude, zoom } = new WebMercatorViewport(this.state.viewport)
            .fitBounds([[-122.4, 37.7], [-122.5, 37.8]]);

          console.log(longitude, latitude, zoom);

          const config = {
            ...this.state.viewport,
            latitude: center[0],
            longitude: center[1],
            // zoom: centerOnMarkers.zoom,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1000
          };

          console.log(config);
          this.updataViewport(config);
        }
      });



    this.resetComponent();
  }

  componentWillReceiveProps(nextProps) {
    const path = nextProps.match
    console.log(nextProps.viewport);
    this.createRoute(path);

    this.setState({ skip: 0, data: [] }, () => {
      this.filterData(path.params)
        .then(() => {
          if (this.state.data.length && path.url !== '/catalog' && path.url !== '/') {
            const centerOnMarkers = this.centerOnMarkers(this.state.data);

            const config = {
              ...this.state.viewport,
              latitude: centerOnMarkers.latitudeCenter,
              longitude: centerOnMarkers.longitudeCenter,
              zoom: centerOnMarkers.zoom,
              transitionInterpolator: new FlyToInterpolator(),
              transitionDuration: 1000
            }

            if (!path.params.coordinatesCenter) this.updataViewport(config);
          }
        });
    })


    console.log(this.state.viewport.width, this.state.viewport.height);
  }

  centerOnMarkers = (data) => {
    const longMax = data.reduce((max, b) => Math.max(max, b.location[0]), data[0].location[0]);

    const longMin = data.reduce((min, b) => Math.min(min, b.location[0]), data[0].location[0]);

    const latMax = data.reduce((max, b) => Math.max(max, b.location[1]), data[0].location[1]);

    const latMin = data.reduce((min, b) => Math.min(min, b.location[1]), data[0].location[1]);

    const longitudeCenter = (Math.abs(longMax - longMin) / 2) + longMin;

    const latitudeCenter = (Math.abs(latMax - latMin) / 2) + latMin;

    const maxLengthDifference = Math.max(Math.abs(longMax - longMin), Math.abs(latMax - latMin));

    let zoom;

    if (maxLengthDifference < 1)
      zoom = 8;
    else if (maxLengthDifference < 60)
      zoom = 2;
    else if (maxLengthDifference < 200)
      zoom = 1;
    console.log(maxLengthDifference, zoom);

    return { longitudeCenter, latitudeCenter, zoom };
  }

  createRoute = (match) => {

    if (match.url === '/' || '') {
      this.setState({
        switchToHome: true
      })
    } else {
      this.setState({
        switchToHome: false
      })
    }

    if (Object.keys(match.params).length === 0) {
      this.setState({
        route: match.url,
        group: '',
        category: '',
        viewpoint: ''
      });
      return;
    }

    if (match.params.viewpoint) {
      this.setState({
        viewpoint: match.params.viewpoint || '',
        group: match.params.group || '',
        category: match.params.category || '',
        route: match.url
      });
      return;
    }

    if (match.params.viewpoint) {
      this.setState({
        viewpoint: match.params.viewpoint || '',
        group: match.params.group || '',
        category: match.params.category || '',
        route: match.url
      });
      return;
    }

    if (match.params.category) {
      this.setState({
        route: match.params.group ? match.url : '/catalog/viewpoints',
        category: match.params.category || '',
        viewpoint: match.params.viewpoint || '',
        group: match.params.group || '',
      });
      return;
    }

    if (match.params.group) {
      this.setState({
        route: match.url,
        group: match.params.group,
        category: match.params.category,
        viewpoint: ''
      });
    }

    if (match.params.radius) {
      this.setState({
        route: '/catalog/viewpoints',
        group: match.params.group || '',
        category: match.params.category || '',
        viewpoint: match.params.viewpoint || ''
      });
    }
  }

  filterData = (path) => {
    console.log(path)
    let type = 'categories';
    let encdURI = '';
    let url = '';
    const defaultRadius = 250;
    const maxRadius = 500;
    const tooBigRadiusAlert = 'Too big cirlce, please reduce radius!';
    const noElementsInAreaAlert = 'No elements in this area!';
    const haveNotAddedElementsAlert = 'Sorry, we have not added any photos yet!';
    const youHaveSeenItAllAlert = 'You have seen it all!'

    if (Object.keys(path).length === 0) {
      this.setState({ data: groups, turnOffInfiniteScroll: true });  // 
      return Promise.resolve();
    }

    if (path.viewpoint) {
      type = 'identifier';
      encdURI = encodeURIComponent(`{${type}: '${path.viewpoint}'}`);
      url = `https://r8p7az51jd.execute-api.us-east-1.amazonaws.com/test/viewpoint?$filter=${encdURI}`;

    } else if (path.category) {
      encdURI = encodeURIComponent(`{${type}: '${path.category}'}`);
      url = `https://r8p7az51jd.execute-api.us-east-1.amazonaws.com/test/viewpoint?$filter=${encdURI}&$skip=${this.state.skip}&$limit=${this.state.limit}`;

    } else if (path.group) {
      type = 'group';
      encdURI = encodeURIComponent(`{${type}: '${path.group}'}`);
      url = `https://r8p7az51jd.execute-api.us-east-1.amazonaws.com/test/category?$filter=${encdURI}&$skip=${this.state.skip}&$limit=${this.state.limit}`;
    } else if (path.coordinatesCenter) {

      if (path.radius > maxRadius) {
        console.log('encdURI');
        this.setState({ alertMessage: tooBigRadiusAlert });
      } else {

        const coordinatesCenter = path.coordinatesCenter.split(';'),
          center = [coordinatesCenter[0], coordinatesCenter[1]],
          radius = path.radius ? path.radius / 3963.2 : defaultRadius / 3963.2;

        encdURI = encodeURIComponent(`{ location : { $geoWithin: { $centerSphere: [[${center}], ${radius}] } } }`);


        url = `https://r8p7az51jd.execute-api.us-east-1.amazonaws.com/test/viewpoint?$filter=${encdURI}`;
      }
    }

    console.log(url);

    return fetch(url)
      .then(response => response.json())
      .then(response => {

        if (!response.length) this.setState({ alertMessage: haveNotAddedElementsAlert });

        if (!response.length && path.coordinatesCenter) this.setState({ alertMessage: noElementsInAreaAlert });

        if (response.length) this.setState({ alertMessage: youHaveSeenItAllAlert });

        this.setState(prevState => ({
          turnOffInfiniteScroll: (response.length && !path.coordinatesCenter) ? true : false,
          data: path.viewpoint ? response : prevState.data.concat(response),
          hasMore: (response.length && !path.coordinatesCenter) ? true : false
        }));
      })
      .catch(error => { console.log(error) });
  }

  ///
  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });

    this.setState({
      group: '',
      category: result.pathId === 'categories' ? result.title : '',
      viewpoint: result.pathId === 'viewpoints' ? result.title : '',
    });

    history.push(`/catalog/${result.pathId}/${result.identifier}`);
    this.handleCloseItem();
  }

  handleSearchChange = (e, { value }) => {

    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      const encodedQuery = encodeURIComponent(`${this.state.value}`);
      const url = `https://r8p7az51jd.execute-api.us-east-1.amazonaws.com/test/search?query=${encodedQuery}`;

      fetch(url)
        .then(response => response.json())
        .then(response => {
          this.setState({
            dataToFilterFromSearch: response
          })
        })
        .catch(error => { console.log(error) });

      const filteredResults = _.reduce(
        this.state.dataToFilterFromSearch,
        (memo, data, name) => {
          data.forEach((item) => { item.pathId = name })
          const results = _.filter(data, isMatch);
          if (results.length) memo[name] = { name, "results": results };
          return memo;
        },
        {},
      )

      this.setState({
        isLoading: false,
        results: filteredResults,
      })
    }, 300)
  }

  handleOpenItem = () => {
    this.setState({
      isItemClicked: true
    });
  }

  handleCloseItem = () => {
    this.setState({
      isItemClicked: false
    });
    // this.updataViewport({
    //   ...this.state.viewport,
    //   zoom: 5,
    //   transitionInterpolator: new FlyToInterpolator(),
    //   transitionDuration: 1000
    // })
  }

  loadMore = () => {
    setTimeout(() => {
      this.setState(prevState => ({
        skip: prevState.skip + 10
      }), () => {
        this.filterData(this.props.match.params);
      });
    }, 500);
  }

  updataViewport = (viewport) => {
    this.setState(prevState => ({
      viewport: {
        ...prevState.viewport,
        ...viewport
      }
    }));
  }

  updatePopUpInfo = (popupInfo) => {
    this.setState({ popupInfo });
  }

  updateUserLocation = (coordinates) => {
    this.setState({
      userLocation: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }
    })
  }

  findInArea = (area) => {
    let center = area.getCenter();
    let ne = area.getNorthEast();

    function getRadius(center, ne) {

      var lat1 = center.lat;
      var lon1 = center.lng;
      var lat2 = ne.lat;
      var lon2 = ne.lng;

      const radius = Math.abs(lat1 - lat2) * 111;
      return radius;
    }

    const radius = Math.floor(getRadius(center, ne));
    history.push(`/location/${area.getCenter().toArray()[0] + ';' + area.getCenter().toArray()[1]}/${radius}`);
    this.handleCloseItem();
  }

  // findInAreaByRoute = (radius, center) => {
  //   const center_lat = center[0],
  //   center_lon = center[1];

  //   const nw_lat = (center_lat + radius) / 111,
  //   nw_lon = center_lon - radius / (111 * Math.cos(center_lat)),

  // }


  handleSwitchBtn = (newActive) => {
    this.setState(prevState => ({
      switchBtn: {
        ...prevState.switchBtn,
        active: newActive
      }
    }));
  }

  handleClose = () => this.handleCloseItem();

  handleToggleSwitchBtn = (event) => {
    const newActive = event.target.innerText.toLowerCase();
    this.handleSwitchBtn(newActive);
  }

  updateSwitchBtn = () => {
    const breakPoint = 576;
    let active;

    const w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth;

    if (width <= breakPoint) {
      active = 'list';
    } else {
      active = 'null';
    }

    this.setState(prevState => ({
      switchBtn: {
        ...prevState.switchBtn,
        active: active
      }
    }));
  }

  render() {
    console.log(this.state.alertMessage);
    const switchBtn = this.state.switchBtn;

    const HomePage = (
      <Home>
        <SemanticGrid >
          <SemanticGrid.Column width={8}>
            <Search
              category
              loading={this.state.isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
              results={this.state.results}
              value={this.state.value}
              minCharacters={3}
              placeholder='Start typing landmark, road number, national park, etc...'
              {...this.props}
            />
          </SemanticGrid.Column>
        </SemanticGrid>
      </Home>
    );

    const switchBtnComponent = (
      <div className="switch-btn" id="toggleSwitchBtn" onClick={this.handleToggleSwitchBtn}>
        <a className={"btn-list" + ' ' + (switchBtn.active === 'list' ? 'switch-btn-active' : '')} >List</a>
        <a className={"btn-map" + ' ' + (switchBtn.active === 'map' ? 'switch-btn-active' : '')} >Map</a>
      </div>
    );

    return (
      <div className="App" >
        {this.state.switchToHome ?
          HomePage
          :
          <Jumbotron className="main-jumbotron" style={{ height: '100vh' }}>
            <NavBar>
              <SemanticGrid >
                <SemanticGrid.Column width={8}>
                  <Search
                    category
                    loading={this.state.isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={this.state.results}
                    value={this.state.value}
                    minCharacters={3}
                    placeholder='Start typing landmark, road number, national park, etc...'
                    {...this.props}
                  />
                </SemanticGrid.Column>
              </SemanticGrid>
            </NavBar >
            <Container className="main-container">
              <Row>
                <Col sm={6} >
                  <ListBreadcrumb handleClose={this.handleClose} {...this.state} >
                    {switchBtn.active !== 'null' && switchBtnComponent}
                  </ListBreadcrumb >


                  {(switchBtn.active === 'list' || switchBtn.active === 'null') && <InfiniteScroll
                    style={{
                      height: '100vh',
                      paddingBottom: '20px',
                      paddingTop: '110px'
                    }}
                    dataLength={this.state.data.length}
                    next={this.loadMore}
                    hasMore={this.state.hasMore}
                    loader={(this.state.group !== '' && !this.state.viewpoint && this.state.hasMore) && <Loader size='small' active inline>Loading...</Loader>}
                    endMessage={(
                      <p style={{ textAlign: "center" }} style={{ margin: '20px' }}>
                        <Message info>
                          <p><strong>{this.state.alertMessage}</strong></p>
                        </Message>
                      </p>
                    )
                    }
                  >
                    <List
                      data={this.state.data}
                      group={this.state.group}
                      category={this.state.category}
                      viewpoint={this.state.viewpoint}
                      route={this.state.route}
                      showBreadcrumb={this.showBreadcrumb}

                      // filterData={this.filterData}
                      handleOpenItem={this.handleOpenItem}
                      isItemClicked={this.state.isItemClicked}
                      handleCloseItem={this.handleCloseItem}
                      goToMapMarker={this.goToMapMarker}

                    // handleSwitchBtn={this.handleSwitchBtn}
                    // switchBtn={switchBtn}
                    />
                  </InfiniteScroll>
                  }

                </Col>
                <Col sm={6} >

                  {(switchBtn.active === 'map' || switchBtn.active === 'null') &&
                    <MapContainer
                      viewport={this.state.viewport}
                      data={this.state.data}
                      group={this.state.group}
                      category={this.state.category}
                      viewpoint={this.state.viewpoint}
                      route={this.state.route}
                      activeMarker={this.state.activeMarker}
                      popupInfo={this.state.popupInfo}
                      userLocation={this.state.userLocation}

                      updataViewport={this.updataViewport}
                      updatePopUpInfo={this.updatePopUpInfo}
                      handleOpenItem={this.handleOpenItem}
                      updateUserLocation={this.updateUserLocation}
                      findInArea={this.findInArea}
                    />
                  }
                </Col>

              </Row>
            </Container>

            <Footer />

          </Jumbotron>
        }
      </div>
    );
  }
}

export default App;

App.propTypes = {
  data: PropTypes.array,
  isItemClicked: PropTypes.bool,
  items: PropTypes.shape({
    name: PropTypes.string,
    isClicked: PropTypes.bool
  }),
  group: PropTypes.string,
  category: PropTypes.string,
  viewpoint: PropTypes.string,
  // switchBtn: PropTypes.shape({
  //   isSwitchBtnVisible: PropTypes.bool,
  //   activeBtn: PropTypes.string
  // })
}
