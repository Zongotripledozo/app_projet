"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("FitTracker")
  const [maxUsers, setMaxUsers] = useState(1000)
  const [maintenance, setMaintenance] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = () => {
    // TODO: Send settings to backend
    setMessage("Paramètres sauvegardés !")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Paramètres de la plateforme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nom de la plateforme</label>
              <Input value={platformName} onChange={e => setPlatformName(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Nombre maximum d'utilisateurs</label>
              <Input type="number" value={maxUsers} onChange={e => setMaxUsers(Number(e.target.value))} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="maintenance" checked={maintenance} onChange={e => setMaintenance(e.target.checked)} />
              <label htmlFor="maintenance">Activer le mode maintenance</label>
            </div>
            <Button onClick={handleSave}>Sauvegarder les paramètres</Button>
            {message && <div className="text-green-600 mt-2">{message}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
