import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { apiUrl } from "@/lib/api"

const adminUrl = `${apiUrl.replace(/\/$/, "")}/admin`

export function AdminRedirectPage() {
  useEffect(() => {
    window.location.replace(adminUrl)
  }, [])

  return (
    <main className="redirect-page">
      <p>Открываем админку…</p>
      <Button asChild><a href={adminUrl}>Открыть</a></Button>
    </main>
  )
}
