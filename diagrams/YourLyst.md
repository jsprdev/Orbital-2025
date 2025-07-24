sequenceDiagram
    participant U as User
    participant RN as React Native App
    participant B as Backend Server
    participant GP as Google Places API
    participant F as Firebase DB

    Note over U,F: Screen 1: AddIdea Modal - Location Search
    
    U->>RN: Opens AddIdea modal
    RN->>RN: Shows location search TextInput
    
    U->>RN: Types in location field
    RN->>RN: fetchPlaceSuggestions(input)
    RN->>RN: setLoadingPlaces(true)
    
    RN->>B: GET /api/places?input={searchText}
    Note over RN,B: Authorization: Bearer {token}
    
    B->>B: verifyToken middleware
    B->>B: PlacesService.autocomplete(input)
    
    B->>GP: GET /maps/api/place/autocomplete/json
    Note over B,GP: Parameters: input, key, language, types, location, radius
    
    GP-->>B: Returns predictions array
    B-->>RN: JSON response with predictions
    RN->>RN: setPlaceSuggestions(data.predictions)
    RN->>RN: setLoadingPlaces(false)
    RN->>U: Shows dropdown with location suggestions
    
    U->>RN: Selects a location from dropdown
    RN->>RN: setLocation(description)
    RN->>RN: setPlaceId(place_id)
    RN->>RN: setPlaceSuggestions([])
    
    U->>RN: Fills other fields & saves
    RN->>B: POST /api/notes (saves to Firebase)
    B-->>RN: Success response
    RN->>U: Modal closes, note saved

    Note over U,F: Screen 2: Location Details Page
    
    U->>RN: Taps on saved location note
    RN->>RN: Navigate to location-details/[id]
    
    RN->>B: GET /api/notes (get note data)
    B-->>RN: Returns note with place_id
    
    RN->>B: GET /api/places/details?placeId={placeId}
    B->>GP: GET /maps/api/place/details/json
    Note over B,GP: Parameters: place_id, key, language
    
    GP-->>B: Returns place details
    B-->>RN: JSON response with place details
    RN->>RN: setPlaceDetails(data.result)
    RN->>U: Renders location details page

    