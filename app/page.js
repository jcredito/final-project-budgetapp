import Image from 'next/image';
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <h1>
          Welcome to <br /> Your Budget App
        </h1>
        <h2> Money Doesn’t Have To Be Messy</h2>
        <p>
          {' '}
          Stop wondering where all your hard-earned money go. Money management
          will help you grow your savings, and you’ll love how you spend your
          money.
        </p>
      </div>
      <div className={styles.heroImage}>
        <Image src="/images/hero.png" alt="Budget" width="600" height="600" />
      </div>
      {/* Add more content for the hero section */}
    </section>
  );
}
