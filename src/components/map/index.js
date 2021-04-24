import React, { useState } from "react";

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Polyline
} from "react-google-maps";

import Markers from "./markers";

const InternalMap = props => {
    return (
        <GoogleMap zoom={2} center={props.path[0]}>
            <Polyline
                path={
                    props.path
                }
                options={
                    props.options
                }
            />
            <Markers path={props.path} />
        </GoogleMap>
    )
}




const MapHoc = withScriptjs(withGoogleMap(InternalMap));

const Map = props => {
    console.log(props.path);
    const [path,] = useState(
        props.path || []
    )
    return (
        <MapHoc
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCZyz2-hYL8jZyEXMi4LSMBOluMwPP2-6Q&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            path={props.path}
            options={
                {
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.5,
                    clickable: false,
                    draggable: false,
                    editable: false,
                    radius: 30000,
                    paths: { path },
                    geodesic: true,
                    zIndex: 2
                }
            }
        />
    )
}

export default Map