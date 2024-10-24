import { APIProvider, Map } from '@vis.gl/react-google-maps';

function GoogleMap() {
    const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? (process.env.GMAPS_API_KEY);
    return (
        <>
            <APIProvider apiKey={GMAPS_API_KEY}>
                <Map
                    style={{width: '100vw', height: '100vh'}}
                    defaultZoom={3}
                    defaultCenter={{lat: 22.54992, lng: 0}}
                    gestureHandling={'greedy'}
                />
            </APIProvider>
        </>
    );
}

export default GoogleMap;