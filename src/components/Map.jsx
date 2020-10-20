import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import TreeInfo from './TreeInfo';
import '../Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l0YWxpbmsiLCJhIjoiY2thbHJsNWloMTNmYzJ5bW54M3ZhY3pycyJ9.6AEc1-JrLZHIYMwmuzTtQg';

export default () => {
  const [state, setState] = useState({
    lat: 40.748360,
    lng: -73.985402,
    zoom: 14
  });

  let mapContainer;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [state.lng, state.lat],
      zoom: state.zoom
    })

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
          'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 15, 7],
          'circle-color': '#2b9348',
          'circle-stroke-color': '#007f5f',
          'circle-stroke-width': 1,
        }
      })

      let labelsShown = false;

      map.on('move', () => {
        let currentLng = map.getCenter().lng.toFixed(6)
        let currentLat = map.getCenter().lat.toFixed(6)
        let currentZoom = map.getZoom().toFixed(0)

        if (currentZoom >= 14) {
          if (labelsShown) return;
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
          labelsShown = true;
        }

        if (currentZoom < 14) {
          if (!labelsShown) return;
          map.removeLayer('trees-label')
          labelsShown = false;
        }
      })

      let treeId = null

      map.on('mousemove', 'trees-id', (e) => {
        map.getCanvas().style.cursor = 'pointer'

        if (treeId) {
          map.removeFeatureState({
            source: 'trees',
            sourceLayer: 'trees',
            layer: 'trees-id',
            id: treeId
          })
        }

        treeId = e.features[0].id
        let commonName = e.features[0].properties.spc_common
        let latinName = e.features[0].properties.spc_latin
        let treeHealth = e.features[0].properties.health
        let address = e.features[0].properties.address
       // let steward = e.features[0].propertis.steward
        let problems = e.features[0].properties.problems
        console.log('TREEID', treeId)
        console.log('properties', e.features[0].properties.spc_latin, latinName)
        console.log(e.features[0])

        map.setFeatureState({
          source: 'trees',
          sourceLayer: 'trees',
          layer: 'trees-id',
          id: treeId
        }, {
          hover: true
        })

      })

      map.on('mouseleave', 'tree-id', function () {
        if (treeId) {
          map.setFeatureState({
            source: 'trees',
            sourceLayer: 'trees',
            layer: 'trees-id',
            id: treeId
          }, {
            hover: false
          })
        }
      })

    })
  }, [state]);

  return (
    <div>
      <div className="Map-header">
        <h1>NYC Trees</h1>
        <p> About · <a href="">Github</a> · <a href="https://dev.socrata.com/foundry/data.cityofnewyork.us/5rq2-4hqu">Dataset</a></p>
      </div>
      <div className="body">
        {/* <TreeInfo /> */}
        <div ref={el=>mapContainer=el} className="mapContainer" />
      </div>
      </div>
  );
};

