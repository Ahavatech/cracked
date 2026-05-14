import type { TeamMember } from '../../lib/types'
import { TeamCard } from '../team/TeamCard'
import { Badge } from '../ui/Badge'
import { MotionGrid, MotionSection } from '../ui/Motion'

export function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <MotionSection className="section section-light team-section" id="team">
      <div className="container">
        <div className="section-header">
          <Badge>Team Members</Badge>
          <h2 className="section-title">Meet Our Dedicated Team</h2>
          <p className="section-copy">
            Our talented team delivers exceptional results and fosters excellence, creativity, and growth in every
            project.
          </p>
        </div>
        <MotionGrid className="team-grid">
          {members.slice(0, 4).map((member) => (
            <TeamCard member={member} key={member.id} />
          ))}
        </MotionGrid>
      </div>
    </MotionSection>
  )
}
