import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Video, FileText, BrainCircuit } from 'lucide-react'
import HomeFeatureCard from "@/components/home-feature-card"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Transform Your Learning Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HomeFeatureCard
              icon={<Video className="h-10 w-10 text-primary" />}
              title="Video Upload"
              description="Upload your lecture videos in MP4 format and let our system process them automatically."
            />
            <HomeFeatureCard
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Transcript Generation"
              description="Get accurate transcripts segmented in 5-minute intervals for easy navigation and review."
            />
            <HomeFeatureCard
              icon={<BrainCircuit className="h-10 w-10 text-primary" />}
              title="Auto MCQ Generation"
              description="Our AI generates multiple-choice questions from your video content to test understanding."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of educators and students who are enhancing their learning experience with our platform.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/upload">
              Get Started Now <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

const testimonials = [
  {
    quote:
      "This platform has revolutionized how I create assessments for my students. The auto-generated MCQs save me hours of work every week.",
    name: "Dr. Sarah Johnson",
    role: "Professor of Computer Science",
  },
  {
    quote:
      "The transcript feature helps me quickly review lecture content and find exactly what I need. It's been a game-changer for my study routine.",
    name: "Michael Chen",
    role: "Graduate Student",
  },
  {
    quote:
      "We've implemented this across our entire department and seen significant improvements in student engagement and assessment quality.",
    name: "Robert Williams",
    role: "Department Chair",
  },
]
