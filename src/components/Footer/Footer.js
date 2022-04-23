import styles from "./Footer.module.scss";

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      <p>
        &copy; <a href="https://stefanovolpatti.com">Stefano Volpatti</a>,{" "}
        {new Date().getFullYear()} &amp; Images via{" "}
        <a href="https://demo.vercel.store/">vercel.com</a>
      </p>
    </footer>
  );
};

export default Footer;
