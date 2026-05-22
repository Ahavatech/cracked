import Link from 'next/link'
import Image from 'next/image'
import { FaDribbble } from 'react-icons/fa'
import { FiLinkedin, FiTwitter } from 'react-icons/fi'
import type { TeamMember } from '../../lib/types'

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Link className="team-card" href={`/team/${member.slug}`}>
      <div className="team-avatar">
        <Image
          src={member.avatar_url || '/assets/team-avatar.png'}
          alt={member.name}
          width={250}
          height={214}
          className="team-avatar-image"
        />
      </div>
      <div className="team-meta">
        <span className="role-pill">+ {member.role_title}</span>
        <div>
          <h3>{member.name}</h3>
          <p>{member.bio || 'Designing intuitive, user-centered experiences.'}</p>
        </div>
        <div className="social-row" aria-label={`${member.name} social links`}>
          {member.social_links?.twitter ? <FiTwitter /> : null}
          {member.social_links?.linkedin ? <FiLinkedin /> : null}
          {member.social_links?.dribbble ? <FaDribbble /> : null}
        </div>
      </div>
    </Link>
  )
}
