
export const getUserLocation = ({ 
  setSearchValue, 
  setMapCenter, 
  setZoom, 
  map, 
  setError 
}) => {
  console.log("Getting user location...");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        // Ensure the Geocoder is available before creating an instance
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(latitude, longitude);
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
              setSearchValue(results[0].formatted_address); // Update search input with the location address
              if (map) map.panTo({ lat: latitude, lng: longitude }); // Update map
            } else {
              setSearchValue("Location not found");
            }
          });
        } else {
          console.error("Geocoder API not available.");
        }

        setMapCenter({ lat: latitude, lng: longitude });
        setZoom(15);
      },
      (err) => {
        setError("Unable to retrieve your location.");
        console.error("Geolocation error:", err);
      }
    );
  } else {
    setError("Geolocation is not supported by this browser.");
    console.error("Geolocation not supported");
  }
};
