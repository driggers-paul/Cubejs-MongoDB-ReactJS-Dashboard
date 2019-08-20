//import React from 'react'
import * as ReactDOM from 'react-dom'
import data from './uscity.json';
import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

type MapProps = {
  center: {
      lat: number,
      lng: number
  },
  defaultZoom: number,
  markers: Array<any>
}

const googleMapURL = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=YourAPIKey'

const MyGoogleMap = withScriptjs(withGoogleMap((props:MapProps) =>
        <GoogleMap
            defaultCenter={props.center}
            defaultZoom={props.defaultZoom}
            options={{disableDefaultUI: true}}>
            {
              ( props.markers != null && props.markers.length > 0) ? 
                props.markers.map((element, index)=>{
                  return (<Marker
                            position={element}
                            key={index}
                          ></Marker>)    
                }) : null
            }
        </GoogleMap>))
const loadingElement = <div/>
const containerElement = <div style={{height: '100vh'}}/>
const mapElement = <div style={{height: '100vh'}}/>

type Props = {
  defaultZoom: number,
  markers: Array<any>,
  center: {lat: number, lng: number}
}

export default class Map extends React.Component<Props> {

  markerArray: Array<any> = [];

  constructor(props) {
    super(props)
    if (props.markers != null && props.markers.length > 0) {
      props.markers.forEach(element => {
        for (let i = 0 ; i < data.length ; i++) {
          if (data[i].city_ascii.toLowerCase() == element['Zips.city'].toLowerCase()) {
            this.markerArray.push(
              {
                lat: data[i].lat,
                lng: data[i].lng
              }
            )
            continue;
          }
        }
      });
    }
  }

  render = () => {
    return (
      <div style={{height: '100vh'}}>
          <MyGoogleMap loadingElement={loadingElement}
                        containerElement={containerElement}
                        googleMapURL={googleMapURL}
                        mapElement={mapElement}
                        center={this.props.center}
                        defaultZoom={this.props.defaultZoom}
                        markers={this.markerArray}
                        />
      </div>
    )
  }
}
