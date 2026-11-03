'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnnouncementBar } from '@/components/site/announcement-bar'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(pathname.startsWith('/admin'))
  }, [pathname])

  if (isAdmin) return <>{children}</>

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  )
}
