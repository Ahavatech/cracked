'use client'

import { useEffect, useState } from 'react'
import {
  clientFetch,
  type ContactSubmissionsResponse,
  type StatsResponse
} from '../../lib/client-api'
import type { ContactSubmission, DashboardStats } from '../../lib/types'
import { Card } from '../../components/ui/Card'

const emptyStats: DashboardStats = {
  members: 0,
  clients: 0,
  pendingReviews: 0,
  projects: 0
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(emptyStats)
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])

  useEffect(() => {
    clientFetch<StatsResponse>('/api/admin/stats')
      .then((data) => setStats(data.stats))
      .catch(() => undefined)
    clientFetch<ContactSubmissionsResponse>('/api/admin/contact-submissions')
      .then((data) => setSubmissions(data.submissions.slice(0, 5)))
      .catch(() => undefined)
  }, [])

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-title">Dashboard</h1>
      </div>
      <div className="stat-cards">
        <Card className="stat-card">
          <span className="stat-number">{stats.members}</span>
          <span className="stat-label">Total Members</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-number">{stats.clients}</span>
          <span className="stat-label">Total Clients</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-number">{stats.pendingReviews}</span>
          <span className="stat-label">Pending Reviews</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-number">{stats.projects}</span>
          <span className="stat-label">Portfolio Projects</span>
        </Card>
      </div>
      <Card className="admin-panel stack-top">
        <h2>Recent Contact Submissions</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
                <td>{submission.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
