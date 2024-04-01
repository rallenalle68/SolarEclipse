import React, { useState } from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

const MyMap = ({ openMapModel }) => {
    const [center, setCenter] = useState([42.12577715603775, -80.08571286130498]);
    const [zoom, setZoom] = useState(17);
    const [hue, setHue] = useState(0);
    const color = `hsl(${hue % 360}deg 39% 70%)`;

    return (
        <Map
            height={700}
            center={center}
            defaultZoom={zoom}
            zoom={zoom}
            color={color}
            onClick={() => setHue(hue + 20)}
            onBoundsChanged={({ center, zoom }) => {
                setCenter(center);
                setZoom(zoom);
            }}
        >
            <ZoomControl />
            <Marker
                width={50}
                anchor={[42.127786437446396, -80.08681813055236]}
                color={color}
                onClick={() => {
                    setHue(hue + 20);
                    openMapModel(1);
                }}
            />
            <Marker
                width={50}
                anchor={[42.127067329994716, -80.08709345332936]}
                color={color}
                onClick={() => {
                    setHue(hue + 20);
                    openMapModel(0);
                }}
            />
            <Marker
                width={50}
                anchor={[42.125222722951726, -80.08550214390186]}
                color={color}
                onClick={() => {
                    setHue(hue + 20);
                    openMapModel(2);
                }}
            />
            {/* Add a marker for "McConnell Family Stadium" */}
            <Marker
                width={50}
                anchor={[42.125222722951736, -80.08550214390186]}
                color={color}
                onClick={() => {
                    setHue(hue + 20);
                    openMapModel(3);
                }}
            />
        </Map>
    );
};

export default MyMap;
