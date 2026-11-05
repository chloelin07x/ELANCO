import { CircleMarker, Popup } from "react-leaflet";

export function severity(count) {
    if (count >= 90) return ["#b10318", "Extremely Dangerous"];
    if (count >= 70) return ["#d82526", "Dangerous"];
    if (count >= 50) return ["#ffc156", "Be Alert"];
    if (count >= 30) return ["#ffdd71", "Be Aware"];
    if (count >= 20) return ["#9fcd99", "Decent"];
    if (count >= 10) return ["#69b764", "Okay"];
    return ["#309343", "Good"];
}

function TickMarker({ pos, count, city, onMarkerClick }) {
    const [colour, text] = severity(count);
    
    return (
        <CircleMarker center={pos} radius={10} pathOptions={{ color: colour }}
            eventHandlers={{ click: () => onMarkerClick(city) }}>
            <Popup>
                City: {city} <br />
                Count: {count} <br />
                Severity: {text}
            </Popup>
        </CircleMarker>
    )
}

export default TickMarker;