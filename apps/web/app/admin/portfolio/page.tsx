'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormEvent, useEffect, useState } from 'react'
import { FiMove } from 'react-icons/fi'
import { clientFetch, type AdminProjectsResponse } from '../../../lib/client-api'
import type { PortfolioProject } from '../../../lib/types'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'

function SortableProjectRow({
  project,
  onEdit,
  onDelete
}: {
  project: PortfolioProject
  onEdit: (project: PortfolioProject) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <tr ref={setNodeRef} style={style} className="draggable-row">
      <td {...attributes} {...listeners}>
        <FiMove />
      </td>
      <td>
        <span className="mini-avatar" />
      </td>
      <td>{project.title}</td>
      <td>{project.category}</td>
      <td>{project.is_visible ? 'Visible' : 'Hidden'}</td>
      <td>
        <div className="actions">
          <button className="small-btn" type="button" onClick={() => onEdit(project)}>
            Edit
          </button>
          <button className="small-btn danger" type="button" onClick={() => onDelete(project.id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [editing, setEditing] = useState<PortfolioProject | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [status, setStatus] = useState('')
  const sensors = useSensors(useSensor(PointerSensor))

  function loadProjects() {
    clientFetch<AdminProjectsResponse>('/api/admin/portfolio')
      .then((data) => setProjects(data.projects))
      .catch((err) => setStatus(err instanceof Error ? err.message : 'Unable to load projects.'))
  }

  useEffect(loadProjects, [])

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = projects.findIndex((project) => project.id === active.id)
    const newIndex = projects.findIndex((project) => project.id === over.id)
    const nextProjects = arrayMove(projects, oldIndex, newIndex).map((project, index) => ({
      ...project,
      display_order: index
    }))
    setProjects(nextProjects)
    await clientFetch('/api/admin/portfolio/reorder', {
      method: 'PATCH',
      body: JSON.stringify({
        items: nextProjects.map((project, index) => ({ id: project.id, display_order: index }))
      })
    })
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      title: String(form.get('title')),
      category: String(form.get('category')),
      description: String(form.get('description')),
      cover_url: String(form.get('cover_url')),
      project_url: String(form.get('project_url')),
      display_order: Number(form.get('display_order') || 0),
      is_visible: form.get('is_visible') === 'on'
    }

    try {
      if (editing) {
        await clientFetch(`/api/admin/portfolio/${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
        setStatus('Project updated.')
      } else {
        await clientFetch('/api/admin/portfolio', { method: 'POST', body: JSON.stringify(payload) })
        setStatus('Project added.')
      }
      setModalOpen(false)
      loadProjects()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unable to save project.')
    }
  }

  async function deleteProject(id: string) {
    await clientFetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' })
    setStatus('Project hidden.')
    loadProjects()
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-title">Portfolio</h1>
        <Button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          Add Project
        </Button>
      </div>
      {status ? <div className="status-message status-success">{status}</div> : null}
      <Card className="admin-panel">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
            <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Drag</th>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <SortableProjectRow
                    key={project.id}
                    project={project}
                    onEdit={(item) => {
                      setEditing(item)
                      setModalOpen(true)
                    }}
                    onDelete={deleteProject}
                  />
                ))}
              </tbody>
            </table>
            </div>
          </SortableContext>
        </DndContext>
      </Card>
      <Modal title={editing ? 'Edit Project' : 'Add Project'} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="form-grid">
            <span>Project Title</span>
            <input className="input" name="title" defaultValue={editing?.title || ''} required />
          </label>
          <label className="form-grid">
            <span>Category</span>
            <input className="input" name="category" defaultValue={editing?.category || ''} />
          </label>
          <label className="form-grid">
            <span>Description</span>
            <textarea className="textarea" name="description" defaultValue={editing?.description || ''} />
          </label>
          <label className="form-grid">
            <span>Cover Image URL</span>
            <input className="input" name="cover_url" defaultValue={editing?.cover_url || ''} />
          </label>
          <label className="form-grid">
            <span>Project URL</span>
            <input className="input" name="project_url" defaultValue={editing?.project_url || ''} />
          </label>
          <label className="form-grid">
            <span>Display Order</span>
            <input className="input" name="display_order" type="number" defaultValue={editing?.display_order || 0} />
          </label>
          <label>
            <input name="is_visible" type="checkbox" defaultChecked={editing?.is_visible ?? true} /> Visible
          </label>
          <Button type="submit">Save Project</Button>
        </form>
      </Modal>
    </>
  )
}
