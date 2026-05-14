'use client'

import { FormEvent, useEffect, useState } from 'react'
import { clientFetch, type AdminClientsResponse } from '../../../lib/client-api'
import type { Client } from '../../../lib/types'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [editing, setEditing] = useState<Client | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [status, setStatus] = useState('')

  function loadClients() {
    clientFetch<AdminClientsResponse>('/api/admin/clients')
      .then((data) => setClients(data.clients))
      .catch((err) => setStatus(err instanceof Error ? err.message : 'Unable to load clients.'))
  }

  useEffect(loadClients, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      company_name: String(form.get('company_name')),
      contact_name: String(form.get('contact_name')),
      email: String(form.get('email'))
    }

    try {
      if (editing) {
        await clientFetch(`/api/admin/clients/${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
        setStatus('Client updated.')
      } else {
        await clientFetch('/api/admin/clients', { method: 'POST', body: JSON.stringify(payload) })
        setStatus('Client added. Setup email sent.')
      }
      setModalOpen(false)
      loadClients()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unable to save client.')
    }
  }

  async function deleteClient(id: string) {
    await clientFetch(`/api/admin/clients/${id}`, { method: 'DELETE' })
    setStatus('Client deleted.')
    loadClients()
  }

  async function sendReviewInvite(id: string) {
    await clientFetch(`/api/admin/clients/${id}/review-invite`, { method: 'POST' })
    setStatus('Review invite sent.')
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-title">Clients</h1>
        <Button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          Add Client
        </Button>
      </div>
      {status ? <div className="status-message status-success">{status}</div> : null}
      <Card className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.company_name}</td>
                <td>{client.contact_name}</td>
                <td>{client.email}</td>
                <td>{client.is_active ? 'Active' : 'Pending'}</td>
                <td>
                  <div className="actions">
                    <button
                      className="small-btn"
                      type="button"
                      onClick={() => {
                        setEditing(client)
                        setModalOpen(true)
                      }}
                    >
                      Edit
                    </button>
                    <button className="small-btn" type="button" onClick={() => sendReviewInvite(client.id)}>
                      Send Review Invite
                    </button>
                    <button className="small-btn danger" type="button" onClick={() => deleteClient(client.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal title={editing ? 'Edit Client' : 'Add Client'} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="form-grid">
            <span>Company Name</span>
            <input className="input" name="company_name" defaultValue={editing?.company_name || ''} required />
          </label>
          <label className="form-grid">
            <span>Contact Name</span>
            <input className="input" name="contact_name" defaultValue={editing?.contact_name || ''} required />
          </label>
          <label className="form-grid">
            <span>Email Address</span>
            <input className="input" name="email" type="email" defaultValue={editing?.email || ''} required />
          </label>
          <Button type="submit">Save Client</Button>
        </form>
      </Modal>
    </>
  )
}
