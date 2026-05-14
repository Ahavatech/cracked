import { Suspense } from 'react'
import { SetupForm } from '../../../components/auth/SetupForm'

export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupForm />
    </Suspense>
  )
}
