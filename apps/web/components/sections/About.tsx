import Image from 'next/image'
import { FaPlay, FaStar } from 'react-icons/fa'
import { Badge } from '../ui/Badge'
import { MotionDiv, MotionSection } from '../ui/Motion'

const stats = [
  ['50+', 'Projects Completed'],
  ['15+', 'Years of Experience'],
  ['10+', 'Satisfied Clients'],
  ['15+', 'Years of Dedication']
]

export function About() {
  return (
    <MotionSection className="section about" id="about">
      <div className="container about-grid">
        <MotionDiv>
          <div className="section-header left">
            <Badge dark>About Us</Badge>
            <h2 className="section-title">Explore Who We Are and What Drives US</h2>
            <p className="section-copy">
              We are a passionate team delivering solutions that help businesses grow and succeed in the digital world.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map(([number, label]) => (
              <div key={label}>
                <span className="stat-number">{number}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </MotionDiv>
        <MotionDiv className="avatar-illustration">
          <div className="watch-demo">
            <span className="play-dot">
              <FaPlay />
            </span>
            <span>
              Watch demo
              <br />
              1:52 Min
            </span>
          </div>
          <div className="avatar-figure" aria-hidden="true">
            <Image src="/assets/about-avatar-full.png" alt="" fill className="about-avatar-image" />
          </div>
          <div className="accent-square">
            <FaStar />
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  )
}
