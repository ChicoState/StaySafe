export const getUserLocation = ({ 
  setSearchValue, 
  setMapCenter, 
  setZoom, 
  map 
}) => {
  console.log("Getting user location...");
  
  const defaultLocation = { lat: 39.7285, lng: -121.8375 }; // Chico, CA
  const defaultZoom = 15;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(latitude, longitude);

          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
              setSearchValue(results[0].formatted_address);
            } else {
              console.warn("Geocoding failed. Status:", status);
              setSearchValue(`Lat: ${latitude}, Lng: ${longitude}`);
            }
          });
        } else {
          console.error("Geocoder API not available.");
          setSearchValue(`Lat: ${latitude}, Lng: ${longitude}`);
        }

        const userLocation = { lat: latitude, lng: longitude };
        setMapCenter(userLocation);
        setZoom(15);

        // Add a pin (marker) for the user's location
        if (map) {
          new google.maps.Marker({
            position: userLocation,
            map,
            title: "You are here!", // Tooltip for the marker
          });
        }

        if (map?.panTo) map.panTo(userLocation);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case err.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          default:
            console.error("An unknown error occurred.");
        }
        console.error("Falling back to default location:", defaultLocation);

        setSearchValue("Chico, CA");
        setMapCenter(defaultLocation);
        setZoom(defaultZoom);

        // Add a fallback marker for the default location
        if (map) {
          new google.maps.Marker({
            position: defaultLocation,
            map,
            title: "Default Location: Chico, CA", // Tooltip for the marker
          });
        }

        if (map?.panTo) map.panTo(defaultLocation);
      },
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
    );
  } else {
    console.error("Geolocation not supported");
    // Fallback to default location
    setSearchValue("Chico, CA");
    setMapCenter(defaultLocation);
    setZoom(defaultZoom);



    if (map?.panTo) map.panTo(defaultLocation);
  }
};
