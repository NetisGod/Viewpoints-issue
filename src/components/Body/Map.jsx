import React, { Component } from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

import ReactMapGL, { Marker, Popup, NavigationControl, FlyToInterpolator } from 'react-map-gl';
import { StylesControl } from 'mapbox-gl-controls';
// import * as MapboxGeocoder from 'mapbox-gl-geocoder';

// import Geocoder from 'react-map-gl-geocoder'

import Geocoder from 'react-mapbox-gl-geocoder'

import '../Body/Map.css'
import svg_find_in_area from '../../img/glyph-iconset-master/svg/si-glyph-arrow-three-way-2.svg'
import svg_find_near_me from '../../img/glyph-iconset-master/svg/si-glyph-arrow-move.svg'

import MarkerInfo from '../../marker-info'
import MarkerImg from '../../marker-img'

import { Link } from 'react-router-dom'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';


import 'mapbox-gl-controls/src/mapbox-gl-controls.css';
// import 'mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


const MAPBOX_TOKEN = "pk.eyJ1Ijoidmhham1payIsImEiOiJjam90bGJzMmMxMmh3M2tybmljb2o4YmtzIn0.qU5_ExGJNUGpTTtdpZ1X0w";

const navStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	padding: '10px'
};

class MapContainer extends Component {

	mapRef = React.createRef();

	componentDidMount() {

		const map = this.mapRef.current.getMap();

		map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body') }));

		map.addControl(new mapboxgl.ScaleControl({ position: 'bottom-right' }));

		window.addEventListener("resize", this.checkMapParameters(map));
	}

	componentWillMount() {
		window.removeEventListener("resize", this.checkMapParameters)
	}

	handleClickedMarker = (item) => {
		this.props.updataViewport({
			...this.props.viewport,
			latitude: item.location[1],
			longitude: item.location[0],
			zoom: 9,
			transitionInterpolator: new FlyToInterpolator(),
			transitionDuration: 1000
		});
		if (this.props.viewpoint) this.props.handleOpenItem();

	}

	updatePopUpInfo = popupInfo => this.props.updatePopUpInfo(popupInfo);

	renderPopup = () => {
		const { popupInfo } = this.props;

		return popupInfo && (
			<Popup tipSize={3}
				anchor="top"
				longitude={popupInfo.location[0]}
				latitude={popupInfo.location[1]}
				closeButton={false}
			// closeOnClick={false}
			// onClose={() => this.updatePopUpInfo(null)}
			>
				<MarkerInfo info={popupInfo} />
			</Popup>
		);
	}

	success = (pos) => {
		var coordinates = pos.coords;

		this.props.updateUserLocation(coordinates);
		this.props.updataViewport({
			...this.props.viewport,
			latitude: coordinates.latitude,
			longitude: coordinates.longitude,
			zoom: 8,
			transitionInterpolator: new FlyToInterpolator(),
			transitionDuration: 1000
		})
	};

	error = err => console.warn(`ERROR(${err.code}): ${err.message}`);


	handleGeocoderViewportChange = (viewport) => {
		const geocoderDefaultOverrides = { transitionDuration: 1000 }
		console.log(viewport);

		return this.props.updataViewport({
			...viewport,
			...geocoderDefaultOverrides
		})
	}

	//test
	checkMapParameters = (map) => {

		const width = document.getElementById('map-container').clientWidth,
			height = document.getElementById('map-container').clientHeight;

		this.props.updataViewport({
			...this.props.viewport,
			width,
			height
		});
		console.log(width);
	}

	render() {
		const FindOnMapButtons = (
			<div className='find-on-map-buttons-container'>
				<OverlayTrigger
					key={`tooltip-find-in-area`}
					placement={`left`}
					overlay={
						<Tooltip id={`tooltip-find-in-area`}>Find in this area</Tooltip>
					}
				>
					<div className="find-in-area-container">
						<Button
							variant="secondary"
							className='find find-in-area-button'
							onClick={() => { this.props.findInArea(this.mapRef.current.getMap().getBounds()) }
							}>
							<img src={svg_find_in_area} alt="svg_find_in_area" />
						</Button>
					</div>
				</OverlayTrigger>

				<OverlayTrigger
					key={`tooltip-find-near-me`}
					placement={`left`}
					overlay={
						<Tooltip id={`tooltip-find-near-me`}>Find near me</Tooltip>
					}
				>
					<div className="find-near-me-container">
						<Button
							variant="secondary"
							className='find find-near-me-button'
							onClick={() => {
								navigator.geolocation.getCurrentPosition(this.success, this.error, this.options),
									setTimeout(() => this.props.findInArea(this.mapRef.current.getMap().getBounds()), 2000);
							}
							}>
							<img src={svg_find_near_me} />
						</Button>
					</div>
				</OverlayTrigger>
			</div>
		);

		return (
			<div id='map-container' className="map-container">
				<Geocoder
					mapboxApiAccessToken={MAPBOX_TOKEN}
					onSelected={this.handleGeocoderViewportChange}
					viewport={this.handleGeocoderViewportChange}
					hideOnSelect={true}
					style={{backgroundColor: 'white'}}
				// queryParams={queryParams}
				/>
				<ReactMapGL
					ref={this.mapRef}
					{...this.props.viewport}
					mapboxApiAccessToken={MAPBOX_TOKEN}
					width="100%"
					height="100%"
					mapStyle="mapbox://styles/mapbox/streets-v9"
					onViewportChange={this.props.updataViewport}
					// style={mapStyle}
					className="map"
					transitionInterpolator={new FlyToInterpolator()}
				>


					{this.props.data.map((item, index) => {
						if (!item.location) return;
						return (
							<Link
								key={`marker-${item.identifier}-${index}`}
								to={this.props.viewpoint ? `${this.props.route}` : `${this.props.route}/${item.identifier}`}
							>
								<Marker
									longitude={item.location[0]}
									latitude={item.location[1]}
								>
									<div
										onClick={(e) => { this.handleClickedMarker(item); this.props.viewpoint && e.preventDefault() }}
										onMouseOver={() => this.updatePopUpInfo(item)}
										onMouseLeave={() => this.updatePopUpInfo(null)}
										onMouseUp={() => this.updatePopUpInfo(null)}
									>
										<MarkerImg size={this.props.viewpoint ? 30 : 20}
											markerStyle={{
												cursor: 'pointer',
												fill: this.props.category ? '#d00' : "#7a1f5f",
												stroke: this.props.viewpoint ? '#b307bf' : "#2007bf"
											}}
										/>
									</div>

								</Marker>
							</Link>
						)
					})}

					{/* <FindNearMe /> */}

					{FindOnMapButtons}

					{/*  Find in area */}

					{this.props.userLocation.latitude && <Marker
						latitude={this.props.userLocation.latitude}
						longitude={this.props.userLocation.longitude}
					>
						<span class="geolocation-marker-dot"></span>
					</Marker>}

					{this.renderPopup()}

					<div className="nav" style={navStyle}>
						<NavigationControl onViewportChange={this.props.updataViewport} />
					</div>

				</ReactMapGL>
			</div >
		);
	}

}

export default MapContainer;