import { db } from "../config/firebase-config";
import axios from 'axios';




export class PlacesService {

  
    async autocomplete(input: string) {
        
        
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        console.log('api key loaded?', apiKey ? 'Loaded' : 'NOT LOADED', apiKey);
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
        const params = {
        input,
        key: apiKey,
        language: 'en',
        types: 'establishment',
        location: '1.3521,103.8198',
        radius: 49000, 
        // components: 'country:SG', // restrict to Singapore
        };
        const response = await axios.get(url, { params });
        return response.data;
    }
}