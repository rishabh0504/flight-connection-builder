import { useState } from "react";
import {
    Marker
} from "react-google-maps";
const Markers = (props) => {
    const { path } = props;
    const [locations, setLocations] = useState(path || []);
    return (
        <div>
            {
                locations && Array.isArray(locations) && locations.map((location, index) => {
                    return (
                        <Marker position={new window.google.maps.LatLng(location.lat, location.lng)} key={index} icon={{
                            url: 'https://img.pngio.com/file4u9525-flight-path4png-wikimedia-commons-red-airplane-png-2000_2000.png',
                            scaledSize: new window.google.maps.Size(16, 16)
                        }} />
                    )
                })

            }
        </div>
    )
}

export default Markers;