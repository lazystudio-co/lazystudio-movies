import React, { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>Have questions, suggestions, or feedback? Get in touch with our team.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.formCard}>
          {sent ? (
            <div className={styles.successMessage}>
              <h3>Thank You!</h3>
              <p>Your message has been successfully logged. We will reach out to you within 24–48 hours.</p>
              <button className={styles.successBtn} onClick={() => setSent(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={6}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className={styles.infoCard}>
          <h3>Direct Contact</h3>
          <p className={styles.infoText}>
            For direct inquiries regarding sponsorships, business proposals, API issues, or technical assistance, you can email us directly.
          </p>
          <div className={styles.detailRow}>
            <strong>Email:</strong>
            <span>support@lazymovies.app</span>
          </div>
          <div className={styles.detailRow}>
            <strong>Office Hours:</strong>
            <span>Mon–Fri, 9:00 AM – 6:00 PM UTC</span>
          </div>

          <div className={styles.badgeInfo}>
            <h4>Partnership Inquiries</h4>
            <p>For strategic partnerships, please specify "Partnership Request" in the email subject line.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
