'use client'

import { useEffect, useState } from 'react'
import { MotionDiv, MotionFade, MotionSection } from '../ui/Motion'

const slides = ['Strategy workshop', 'Design review', 'Launch planning']

export function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 3500)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <MotionSection className="hero">
      <div className="container">
        <MotionDiv className="hero-eyebrow">
          <span className="avatar-stack" aria-hidden="true">
            <span className="mini-avatar" />
            <span className="mini-avatar" />
            <span className="mini-avatar" />
          </span>
          <span>Proudly Serving 10+ Clients</span>
        </MotionDiv>
        <MotionDiv className="hero-title-wrap">
          <h1>
          Launch Smarter with Strategic
          <br />
          Design That Performs
          </h1>
          <p className="section-copy">
          Design should feel good and do good. We blend creativity with intent to build brands that are both beautiful
          and effective.
          </p>
        </MotionDiv>
        <MotionFade className="hero-panel" ariaLabel={slides[active]}>
          {slides.map((slide, index) => (
            <div className={`hero-scene ${active === index ? 'active' : ''}`} key={slide}>
              <span className="hero-shape one" />
              <span className="hero-shape two" />
              <span className="hero-shape three" />
              <span className="hero-table" />
              <span className="hero-person hero-person-one" />
              <span className="hero-person hero-person-two" />
              <span className="hero-person hero-person-three" />
            </div>
          ))}
        </MotionFade>
        <div className="dot-row" aria-label="Hero carousel pagination">
          {slides.map((slide, index) => (
            <button
              className={`dot ${active === index ? 'active' : ''}`}
              key={slide}
              type="button"
              aria-label={`Show ${slide}`}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      </div>
    </MotionSection>
  )
}
