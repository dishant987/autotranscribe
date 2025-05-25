import { type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface HomeFeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function HomeFeatureCard({ icon, title, description }: HomeFeatureCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}
