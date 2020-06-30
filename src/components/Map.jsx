import React, { useState, useEffect } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l0YWxpbmsiLCJhIjoiY2thbHJsNWloMTNmYzJ5bW54M3ZhY3pycyJ9.6AEc1-JrLZHIYMwmuzTtQg';

export default () => {
  const [state, setState] = useState({
    lat: 40.748360,
    lng: -73.985402,
    zoom: 10
  });

  let mapContainer;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [state.lng, state.lat],
      zoom: state.zoom
    });

    map.on('load', () => {
      fetch(`https://data.cityofnewyork.us/resource/5rq2-4hqu.json?zip_city=New%20York&$select=tree_id,%20spc_common,%20the_geom,%20spc_latin&$limit=1000`)
        .then(res => res.json())
        .then(json => {
          json.forEach((tree) => {
            const m = new Marker()
              .setLngLat(tree.the_geom.coordinates)
              .addTo(map)
          });
        });
    });
  }, [state]);

  return (
    <div>
      <div ref={el=>mapContainer=el} className="mapContainer" />
    </div>
  );
};

// class Map extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       lng: 5,
//       lat: 34,
//       zoom: 2
//     }
//   }

//   componentDidMount() {
//     const map = new mapboxgl.Map({
//       container: this.mapContainer,
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [this.state.lng, this.state.lat],
//       zoom: this.state.zoom
//     })
//   }

//   render() {
//     return (
//       <div>
//         <div ref={el=>this.mapContainer=el} className="mapContainer" />
//       </div>
//     )
//   }
// }

// export default Map
