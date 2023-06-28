import styles from './page.module.css';

export default function HomePage() {
  return (
    <div>
      <section className={styles.hero}>
        <img
          src="/images/hero.png
        "
          alt="Budget"
        />
        <h1>Welcome to Your Budget App</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
        {/* Add more content for the hero section */}
      </section>
    </div>
  );
}
