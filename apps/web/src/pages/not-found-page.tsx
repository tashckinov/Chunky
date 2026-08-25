import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NotFoundPage() {
  return (
    <Card>
      <CardHeader><CardTitle>Страница не найдена</CardTitle></CardHeader>
      <CardContent><Button asChild><Link to="/">На главную</Link></Button></CardContent>
    </Card>
  )
}
