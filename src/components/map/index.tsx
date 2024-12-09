"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

type Props  = {
    origin: string,
    destination: string
}

export default function Mapa( props: Props) {
    
    return(
        <div style={{height:'100%', width: '100%'}}>
            <APIProvider apiKey={"AIzaSyAypS4QQbX6rnHntFda-rNxXDbO0aCOUN4"} onLoad={() => console.log('Maps API has loaded.')}>
                <Map disableDefaultUI>
                    <Directions origin={props.origin} destination={props.destination}/>
                </Map>
            </APIProvider>
        </div>
    )
}

function Directions(props: Props){
    const {origin, destination} = props;
    
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>()
    const [DirectionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>()
    
    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map])

    useEffect(() => {
        if (!directionsService || !DirectionsRenderer) return;
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }).then(response =>{
            DirectionsRenderer.setDirections(response)
        })
    }, [directionsService, DirectionsRenderer])

    return null
}
