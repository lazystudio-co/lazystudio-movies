import React from 'react'
import styles from './Terms.module.css'

export default function Terms() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.updated}>Last Updated: August 9, 2026</p>

      <section className={styles.section}>
        <h2>1. Agreement to Terms</h2>
        <p>
          Welcome to LazyMovies (lazymovies.vercel.app). These Terms of Service ("Terms") govern your access to and use of our website, tools, and services (collectively, the "Service").
        </p>
        <p>
          By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not access or use the Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Intellectual Property Rights</h2>
        <p>
          Unless otherwise stated, LazyMovies and/or its licensors own the intellectual property rights for all material on LazyMovies. All intellectual property rights are reserved. You may access this from LazyMovies for your own personal use subjected to restrictions set in these terms.
        </p>
        <p>
          You must not:
        </p>
        <ul>
          <li>Republish material from LazyMovies</li>
          <li>Sell, rent or sub-license material from LazyMovies</li>
          <li>Reproduce, duplicate or copy material from LazyMovies</li>
          <li>Redistribute content from LazyMovies</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Third-Party Services and APIs</h2>
        <p>
          Our Service integrates third-party services, including but not limited to the TMDB API for metadata indexing and external video hosting entities.
        </p>
        <p>
          You acknowledge that LazyMovies is a search indexing service and metadata provider. We do not host, store, upload, or control any of the video files or streams linked or embedded on the website. Users access third-party servers and widgets at their own risk, subject to the terms and privacy guidelines of those external providers.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. User Conduct</h2>
        <p>
          You agree to use the Service in compliance with all applicable laws and regulations. You shall not perform any action that impairs the security, availability, or performance of the Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Disclaimer of Warranties</h2>
        <p>
          The Service is provided "as is" and "as available" without any warranties of any kind, express or implied. LazyMovies does not warrant that the Service will meet your requirements, be uninterrupted, timely, secure, or error-free.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall LazyMovies, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of or inability to use the Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws, without regard to conflict of law principles.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. Contact Information</h2>
        <p>
          If you have any questions or feedback regarding these Terms, please contact us via the Contact Us section.
        </p>
      </section>
    </div>
  )
}
