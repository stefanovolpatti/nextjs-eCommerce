import Head from "next/head";
import { FaExternalLinkAlt } from "react-icons/fa";

import Layout from "@components/Layout";
import Container from "@components/Container";

import styles from "@styles/Page.module.scss";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import center from "@turf/center";
import { points } from "@turf/helpers";
import Map from "@components/Map";
import { useEffect, useState } from "react";

export default function Stores({ storeLocations }) {
  const [activeStore, setActiveStore] = useState();

  const features = points(
    storeLocations.map(({ location }) => {
      return [location.longitude, location.latitude];
    })
  );

  const [defaultLatitude, defaultLongitude] =
    center(features)?.geometry.coordinates;

  return (
    <Layout>
      <Head>
        <title>Store</title>
        <meta name="description" content="Find your store here" />
      </Head>

      <Container>
        <h1>Locations</h1>

        <div className={styles.stores}>
          <div className={styles.storesLocations}>
            <ul className={styles.locations}>
              {storeLocations.map((location) => {
                function handleOnClick() {
                  setActiveStore(location.id);
                }

                return (
                  <li key={location.id}>
                    <p className={styles.locationName}>{location.name}</p>
                    <address>{location.address}</address>
                    <p>{location.phoneNumber}</p>
                    <p className={styles.locationDiscovery}>
                      <button onClick={handleOnClick}>Map</button>
                      <a
                        href={`https://www.google.it/maps/dir//${location.location.latitude},${location.location.longitude}/@${location.location.latitude},${location.location.longitude},17z/`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions
                        <FaExternalLinkAlt />
                      </a>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.storesMap}>
            <div className={styles.storesMapContainer}>
              <Map
                className={styles.map}
                center={[defaultLatitude, defaultLongitude]}
                zoom={2}
                scrollWheelZoom={false}
              >
                {({ TileLayer, Marker, Popup }, map) => {
                  const MapEffect = () => {
                    useEffect(() => {
                      return () => {
                        if (!activeStore) return;
                        const { location } = storeLocations.find(
                          ({ id }) => id === activeStore
                        );
                        map.setView(
                          [location.latitude, location.longitude],
                          14
                        );
                      };
                    }, [activeStore]);
                    return null;
                  };
                  return (
                    <>
                      <MapEffect />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {storeLocations.map((location) => {
                        const { latitude, longitude } = location.location;
                        return (
                          <Marker
                            position={[latitude, longitude]}
                            key={location.id}
                          >
                            <Popup>
                              <p>{location.name}</p>
                              <p>{location.address}</p>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </>
                  );
                }}
              </Map>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api-eu-central-1.graphcms.com/v2/cl21wrirq4ip201xtd02e8qpz/master",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query PageStores {
        storeLocations {
          address
          id
          name
          phoneNumber
          location {
            latitude
            longitude
          }
        }
      }
    `,
  });
  const storeLocations = data.storeLocations;
  return {
    props: {
      storeLocations,
    },
  };
}
