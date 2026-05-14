'use client'

import { FormEvent, useEffect, useState } from 'react'
import { clientFetch, type AdminMembersResponse } from '../../../lib/client-api'
import type { TeamMember } from '../../../lib/types'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'

type MemberFormState = TeamMember | null

export default function AdminMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [editing, setEditing] = useState<MemberFormState>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [status, setStatus] = useState('')

  function loadMembers() {
    clientFetch<AdminMembersResponse>('/api/admin/members')
      .then((data) => setMembers(data.members))
      .catch((err) => setStatus(err instanceof Error ? err.message : 'Unable to load members.'))
  }

  useEffect(loadMembers, [])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(member: TeamMember) {
    setEditing(member)
    setModalOpen(true)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      name: String(form.get('name')),
      email: String(form.get('email')),
      role_title: String(form.get('role_title')),
      bio: String(form.get('bio')),
      avatar_url: String(form.get('avatar_url')),
      social_links: {
        twitter: String(form.get('twitter')),
        linkedin: String(form.get('linkedin')),
        dribbble: String(form.get('dribbble'))
      },
      skills: String(form.get('skills') || '')
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      display_order: Number(form.get('display_order') || 0),
      is_visible: form.get('is_visible') === 'on'
    }

    try {
      if (editing) {
        await clientFetch(`/api/admin/members/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        })
        setStatus('Member updated.')
      } else {
        await clientFetch('/api/admin/members', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
        setStatus(`Member added. Setup email sent to ${payload.email}.`)
      }
      setModalOpen(false)
      loadMembers()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unable to save member.')
    }
  }

  async function deleteMember(id: string) {
    await clientFetch(`/api/admin/members/${id}`, { method: 'DELETE' })
    setStatus('Member hidden.')
    loadMembers()
  }

  async function resendInvite(id: string) {
    await clientFetch(`/api/admin/members/${id}/resend-invite`, { method: 'POST' })
    setStatus('Setup email resent.')
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-title">Members</h1>
        <Button onClick={openCreate}>Add Member</Button>
      </div>
      {status ? <div className="status-message status-success">{status}</div> : null}
      <Card className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <span className="mini-avatar" />
                </td>
                <td>{member.name}</td>
                <td>{member.role_title}</td>
                <td>{member.email}</td>
                <td>{member.is_active ? 'Active' : 'Pending'}</td>
                <td>
                  <div className="actions">
                    <button className="small-btn" type="button" onClick={() => openEdit(member)}>
                      Edit
                    </button>
                    <button className="small-btn" type="button" onClick={() => resendInvite(member.id)}>
                      Resend Setup Email
                    </button>
                    <button className="small-btn danger" type="button" onClick={() => deleteMember(member.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal title={editing ? 'Edit Member' : 'Add Member'} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="form-grid">
            <span>Full Name</span>
            <input className="input" name="name" defaultValue={editing?.name || ''} required />
          </label>
          <label className="form-grid">
            <span>Email Address</span>
            <input className="input" name="email" type="email" defaultValue={editing?.email || ''} required />
          </label>
          <label className="form-grid">
            <span>Role / Job Title</span>
            <input className="input" name="role_title" defaultValue={editing?.role_title || ''} required />
          </label>
          <label className="form-grid">
            <span>Short Bio</span>
            <textarea className="textarea" name="bio" defaultValue={editing?.bio || ''} />
          </label>
          <label className="form-grid">
            <span>Avatar URL</span>
            <input className="input" name="avatar_url" defaultValue={editing?.avatar_url || ''} />
          </label>
          <label className="form-grid">
            <span>Twitter URL</span>
            <input className="input" name="twitter" defaultValue={editing?.social_links?.twitter || ''} />
          </label>
          <label className="form-grid">
            <span>LinkedIn URL</span>
            <input className="input" name="linkedin" defaultValue={editing?.social_links?.linkedin || ''} />
          </label>
          <label className="form-grid">
            <span>Dribbble URL</span>
            <input className="input" name="dribbble" defaultValue={editing?.social_links?.dribbble || ''} />
          </label>
          <label className="form-grid">
            <span>Skills / Expertise comma separated</span>
            <input className="input" name="skills" defaultValue={editing?.skills?.join(', ') || ''} />
          </label>
          <label className="form-grid">
            <span>Display Order</span>
            <input className="input" name="display_order" type="number" defaultValue={editing?.display_order || 0} />
          </label>
          <label>
            <input name="is_visible" type="checkbox" defaultChecked={editing?.is_visible ?? true} /> Visible
          </label>
          <Button type="submit">Save Member</Button>
        </form>
      </Modal>
    </>
  )
}
