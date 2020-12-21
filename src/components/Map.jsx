import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import TreeInfo from './TreeInfo';
import '../Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l0YWxpbmsiLCJhIjoiY2thbHJsNWloMTNmYzJ5bW54M3ZhY3pycyJ9.6AEc1-JrLZHIYMwmuzTtQg';

export default () => {
  const [coords, setCoords] = useState({
    lat: 40.748360,
    lng: -73.985402,
    zoom: 14
  });

  const [commonName, setCommonName] = useState('')
  const [latinName, setLatinName] = useState('')
  const [treeHealth, setTreeHealth] = useState('')
  const [address, setAddress] = useState('')
  const [problems, setProblems] = useState('')
  const [treeInfoVisibility, setTreeInfoVisibility] = useState(false);

  const GoToCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not available.');

    navigator.geolocation.getCurrentPosition((p) => {
      setCoords({ lat: p.coords.latitude, lng: p.coords.longitude, zoom: 18 })
    });
  };


  let mapContainer;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coords.lng, coords.lat],
      zoom: coords.zoom
    })

    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
    }));

    map.addControl(new mapboxgl.NavigationControl())

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

        setCommonName(e.features[0].properties.spc_common)
        setLatinName(e.features[0].properties.spc_latin)
        setTreeHealth(e.features[0].properties.health)
        setAddress(e.features[0].properties.address)
        setProblems(e.features[0].properties.problems)

        console.log('COMMON NAME', commonName)


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
          setCommonName('')
          setLatinName('')
          setTreeHealth('')
          setAddress('')
          setProblems('')
        }
      })

    })
  }, [coords]);

  return (
    <div>
      <div className="body">
        <SideInfo>
          <div className="Map-header">
            <h1>NYC Trees</h1>
            <p><a href="https://github.com/gitalink">Github</a> · <a href="https://dev.socrata.com/foundry/data.cityofnewyork.us/5rq2-4hqu">Dataset</a></p>
          </div>
          {/* <LocationBtn onClick={GoToCurrentLocation}>
            <FontAwesomeIcon icon={faLocationArrow} style={{fontSize: '1.3em'}} />
          </LocationBtn> */}
        </SideInfo>
        <TreeInfo hidden={treeInfoVisibility} latinName={latinName} commonName={commonName} health={treeHealth} />
        <div ref={el=>mapContainer=el} className="mapContainer" />
      </div>
    </div>
  );
};

const SideInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 9999;
`;

const LocationBtn = styled.button`
  border: none;
  width: 5em;
  height: 5em;
  margin: 1em;
  border-radius: 5em;
  cursor: pointer;
  outline: none;
  background: white;
  box-shadow: 2px 2px 2px 0.5px #888888;
`
