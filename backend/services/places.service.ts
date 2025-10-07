import { db } from "../config/firebase-config";
import axios from 'axios';




export class PlacesService {

    async getPlaceDetails(placeId: string) {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const url = `http://maps.googleapis.com/maps/api/place/details/json`;
        const params = {
          place_id: placeId,
          key: apiKey,
          language: 'en',
        };
        const response = await axios.get(url, { params });
        return response.data;
      }

  
    async autocomplete(input: string) {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const url = `http://maps.googleapis.com/maps/api/place/autocomplete/json`;
        const params = {
        input,
        key: apiKey,
        language: 'en',
        types: 'establishment',
        location: '1.3521,103.8198',
        radius: 49000, 
        // components: 'country:SG', // need figure out how to get local device location or maybe we just put as radius of sg
        };
        const response = await axios.get(url, { params });
        return response.data;
    }
}