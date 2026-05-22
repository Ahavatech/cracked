import { BackendWarmup } from './BackendWarmup'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackendWarmup />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
