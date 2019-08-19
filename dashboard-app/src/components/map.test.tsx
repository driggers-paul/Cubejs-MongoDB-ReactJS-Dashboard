/*import React from 'react';
import renderer from 'react-test-renderer';
import Map from './map';

test('<Map /> renders with null markers as prop', () => {
  const defaultCenter = {lat: 39.833333, lng: -98.583333}
  const tree = renderer.create(
    <Map center={defaultCenter}
    defaultZoom={4}
    markers={null} />
  ).toJSON();
  
  expect(tree).toMatchSnapshot();
});*/

import * as React from 'react';
import * as enzyme from 'enzyme';
import Map from './map';

it('<Map /> renders with null markers as prop', () => {
  const defaultCenter = {lat: 39.833333, lng: -98.583333}
  const map = enzyme.shallow(
  <Map center={defaultCenter}
    defaultZoom={4}
    markers={null} /> 
  );
  expect(map).toMatchSnapshot();
});