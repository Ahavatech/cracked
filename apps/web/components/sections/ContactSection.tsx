'use client'

import { FormEvent, useState } from 'react'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { clientFetch } from '../../lib/client-api'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type Status = { type: 'success' | 'error'; message: string } | null

export function ContactSection() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setStatus(null)
    const form = new FormData(event.currentTarget)

    try {
      await clientFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          subject: form.get('subject'),
          message: form.get('message')
        })
      })
      event.currentTarget.reset()
      setStatus({ type: 'success', message: "Message sent! We'll be in touch soon." })
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Unable to send message.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section section-white" id="contact">
      <div className="container contact-grid">
        <div>
          <div className="section-header left">
            <Badge>Contact Us</Badge>
            <h2 className="section-title">Let's Build Something Great Together</h2>
            <p className="section-copy">
              Tell us what you are building. We will respond with a practical next step and a clear path forward.
            </p>
          </div>
          <div className="info-list">
            <div className="info-row">
              <FiMail />
              <span>Cracked.dev@yahoo.com</span>
            </div>
            <div className="info-row">
              <FiMapPin />
              <span>55 Fajuyi Str., Redcross Hall, Obafemi Awolowo University</span>
            </div>
            <div className="info-row">
              <FiPhone />
              <span>Available on request</span>
            </div>
          </div>
        </div>
        <Card className="contact-form">
          <form className="form-grid" onSubmit={onSubmit}>
            <label className="form-grid">
              <span>Full Name</span>
              <input className="input" name="name" required />
            </label>
            <label className="form-grid">
              <span>Email Address</span>
              <input className="input" name="email" type="email" required />
            </label>
            <label className="form-grid">
              <span>Subject</span>
              <input className="input" name="subject" />
            </label>
            <label className="form-grid">
              <span>Message</span>
              <textarea className="textarea" name="message" rows={5} required />
            </label>
            {status ? <div className={`status-message status-${status.type}`}>{status.message}</div> : null}
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
