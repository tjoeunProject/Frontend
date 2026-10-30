import assert from 'node:assert/strict';
import test from 'node:test';
import { decodePolyline } from '../src/utils/polylineDecode.js';

// Independent expected coordinates from Google's E5 polyline specification:
// https://developers.google.com/maps/documentation/utilities/polylinealgorithm
test('decodes the official Google example at five decimal places', () => {
  assert.deepEqual(decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@'), [
    { lat: 38.5, lng: -120.2 },
    { lat: 40.7, lng: -120.95 },
    { lat: 43.252, lng: -126.453 },
  ]);
});

test('an empty path has no coordinates', () => {
  assert.deepEqual(decodePolyline(''), []);
});

test('preserves a coordinate at the origin', () => {
  assert.deepEqual(decodePolyline('??'), [{ lat: 0, lng: 0 }]);
});

test('preserves repeated zero-delta points', () => {
  assert.deepEqual(decodePolyline('????'), [{ lat: 0, lng: 0 }, { lat: 0, lng: 0 }]);
});

test('decodes one negative E5 latitude increment', () => {
  assert.deepEqual(decodePolyline('@?'), [{ lat: -0.00001, lng: 0 }]);
});

test('decodes one positive E5 longitude increment', () => {
  assert.deepEqual(decodePolyline('?A'), [{ lat: 0, lng: 0.00001 }]);
});
