import iconMarker2x from "leaflet/dist/images/marker-icon-2x.png";
import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconMarkerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";
import { useEffect } from "react";
import * as ReactLeaflet from "react-leaflet";

const { MapContainer, MapConsumer } = ReactLeaflet;

const Map = ({ className, children, ...rest }) => {
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    return () => {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconMarker2x.src,
        iconUrl: iconMarker.src,
        shadowUrl: iconMarkerShadow.src,
      });
    };
  }, []);

  return (
    <MapContainer className={mapClassName} {...rest}>
      <MapConsumer>{(map) => children(ReactLeaflet, map)}</MapConsumer>
    </MapContainer>
  );
};
export default Map;
