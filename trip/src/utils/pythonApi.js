import api from '../pages/Login/axiosConfig.js';

export function normalizePythonPayload(data, publicMapsKey) {
  const place = item => {
    if (!item?.photo_reference || item.photoUrl || !publicMapsKey) return item;
    const query = new URLSearchParams({maxwidth:'500',photoreference:item.photo_reference,key:publicMapsKey});
    return {...item,photoUrl:`https://maps.googleapis.com/maps/api/place/photo?${query}`};
  };
  return {...data,
    ...(data?.optimized_places && {optimized_places:data.optimized_places.map(day=>day.map(place))}),
    ...(data?.recommendations && {recommendations:data.recommendations.map(place)}),
  };
}

export function createPythonApi(client = api, publicMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
  const post = (path, body) => client.post(`/py/${path}`, body).then(response => ({
    ...response, data:normalizePythonPayload(response.data,publicMapsKey),
  }));
  return {generate:body=>post('generate',body),optimize:body=>post('optimize',body),nearby:body=>post('nearby',body)};
}
export default createPythonApi();
