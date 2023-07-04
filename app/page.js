import Image from 'next/image';
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <div>
      <section className={styles.hero}>
        <Image src="/images/hero.png" alt="Budget" width="600" height="600" />
        <h1>Welcome to Your Budget App</h1>
        <h2> Money Doesn’t Have To Be Messy</h2>
        <p>
          {' '}
          Stop wondering where all your hard-earned money go. Money management
          will help you grow your savings, and you’ll love how you spend your
          money.
        </p>
        {/* Add more content for the hero section */}
      </section>
    </div>
  );
}
