import Head from "next/head";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import Layout from "@components/Layout";
import Container from "@components/Container";
import Button from "@components/Button";

import styles from "@styles/Page.module.scss";
import { buildImage } from "@lib/cloudinary";
import Image from "next/image";

export default function Home({ home, products }) {
  const { heroTitle, heroText, heroLink, heroBackground } = home;
  return (
    <Layout>
      <Head>
        <title>Next Ecommerce</title>
        <meta name="description" content="Welcome to NextJS Ecommerce!" />
      </Head>

      <Container>
        <h1 className="sr-only">Next Ecommerce</h1>

        <div className={styles.hero}>
          <div className={styles.alert}>
            <p>{heroText}</p>
          </div>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
              </div>
              <Image
                className={styles.heroImage}
                src={buildImage(heroBackground.public_id).toURL()}
                width={heroBackground.width}
                height={heroBackground.height}
                alt="hero background"
              />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.map((product) => {
            const imageUrl = buildImage(product.image.public_id)
              .resize("w_900,h_900")
              .toURL();
            return (
              <li key={product.slug}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <Image
                        width={product.image.width}
                        height={product.image.height}
                        src={imageUrl}
                        alt="products images"
                      />
                    </div>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productPrice}>${product.price}</p>
                  </a>
                </Link>
                <p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={product.id}
                    data-item-price={product.price}
                    data-item-url={`/products/${product.slug}`}
                    data-item-image={product.image.url}
                    data-item-name={product.name}
                  >
                    Add to Cart
                  </Button>
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const client = new ApolloClient({
    uri: "https://api-eu-central-1.graphcms.com/v2/cl21wrirq4ip201xtd02e8qpz/master",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query PageHome($locale: Locale!) {
        page(where: { slug: "home" }) {
          id
          heroLink
          heroText
          heroTitle
          name
          slug
          heroBackground
          localizations(locales: [$locale]) {
            heroText
            heroTitle
            locale
          }
        }
        products(where: { categories_some: { slug: "featured" } }) {
          id
          name
          price
          slug
          image
        }
      }
    `,
    variables: {
      locale,
    },
  });

  let home = data.page;
  if (home.localizations.length > 0) {
    home = {
      ...home,
      ...home.localizations[0],
    };
  }
  const products = data.products;
  return {
    props: {
      home,
      products,
    },
  };
}
