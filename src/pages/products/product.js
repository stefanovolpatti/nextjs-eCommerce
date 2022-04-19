import Head from "next/head";

import Layout from "@components/Layout";
import Header from "@components/Header";
import Container from "@components/Container";
import Button from "@components/Button";

import styles from "@styles/Product.module.scss";

export default function Product() {
  return (
    <Layout>
      <Head>
        <title>Product Name</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>Image</div>
          <div className={styles.productContent}>
            <h1>Product Name</h1>
            <div className={styles.productDescription}>
              <p>Description</p>
            </div>
            <p className={styles.productPrice}>$0.00</p>
            <p className={styles.productBuy}>
              <Button>Add to Cart</Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
