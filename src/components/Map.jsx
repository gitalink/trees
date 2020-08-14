import React, { useState, useEffect } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l0YWxpbmsiLCJhIjoiY2thbHJsNWloMTNmYzJ5bW54M3ZhY3pycyJ9.6AEc1-JrLZHIYMwmuzTtQg';

export default () => {
  const [state, setState] = useState({
    lat: 40.748360,
    lng: -73.985402,
    zoom: 9
  });

  let mapContainer;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [state.lng, state.lat],
      zoom: state.zoom
    });

    // map.on('load', function() {
    //   map.addSource('trees-tiles', )
    // })

    map.on('load', () => {
      map.addSource('trees', {
        type: 'vector',
        url: 'mapbox://gitalink.trees-tiles'
      })

      map.addLayer({
        'id': 'trees-id',
        'type': 'circle',
        'source': 'trees',
        'source-layer': 'trees',
        'paint': {
          'circle-radius': 7,
          'circle-color': '#ff69b4'
        }
      })

      map.addLayer({
        'id': 'trees-label',
        'type': 'symbol',
        'source': 'trees',
        'source-layer': 'trees',
        'layout': {
          'text-field': ['get', 'spc_common'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.5,
        'text-justify': 'auto'
        }
      })

    //   fetch(`https://data.cityofnewyork.us/resource/5rq2-4hqu.json?zip_city=New%20York&$select=tree_id,%20spc_common,%20the_geom,%20spc_latin&$limit=1000`)
    //     .then(res => res.json())
    //     .then(json => {
    //       json.forEach((tree) => {
    //         const m = new Marker()
    //           .setLngLat(tree.the_geom.coordinates)
    //           .addTo(map)
    //       });
    //     });
    });
  }, [state]);

  return (
    <div>
      <h1>New York City Trees Mapped</h1>
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
