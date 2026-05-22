import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FiArrowLeft, FiLinkedin, FiTwitter } from 'react-icons/fi'
import { FaDribbble } from 'react-icons/fa'
import { PublicLayout } from '../../../components/layout/PublicLayout'
import { getMember } from '../../../lib/api'

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  const member = await getMember(params.slug)

  if (!member) {
    notFound()
  }

  return (
    <PublicLayout>
      <section className="profile-hero">
        <div className="container profile-grid">
          <div className="profile-avatar">
            <Image src={member.avatar_url || '/assets/team-avatar.png'} alt={member.name} width={140} height={140} />
          </div>
          <div>
            <h1 className="section-title">{member.name}</h1>
            <p className="section-copy">{member.role_title}</p>
            <p>{member.bio || 'A Cracked.dev team member focused on thoughtful, business-aligned execution.'}</p>
            <div className="social-row">
              {member.social_links?.twitter ? <FiTwitter /> : null}
              {member.social_links?.linkedin ? <FiLinkedin /> : null}
              {member.social_links?.dribbble ? <FaDribbble /> : null}
            </div>
          </div>
        </div>
      </section>
      <section className="section section-white">
        <div className="container">
          <div className="section-header left">
            <h2 className="section-title">About {member.name}</h2>
            <p className="section-copy">
              {member.bio ||
                'This profile is available while the member completes onboarding. More details can be added by the superadmin.'}
            </p>
          </div>
          <div className="tag-row">
            {(member.skills?.length ? member.skills : ['Strategy', 'Design Systems', 'Delivery']).map((skill) => (
              <span className="tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>
          <p>
            <Link className="inline-icon-link" href="/#team">
              <FiArrowLeft />
              Back to Team
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
