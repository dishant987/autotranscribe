import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GraduationCap } from 'lucide-react'
import { motion } from "framer-motion"

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  }

  return (
    <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background py-20 px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        <div className="grid grid-cols-6 h-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-r border-primary/5"></div>
          ))}
        </div>
        <div className="grid grid-rows-6 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-primary/5"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div
              variants={item}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              <span>Smart Learning Platform</span>
            </motion.div>
            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transform Videos into <span className="text-primary">Interactive Learning</span>
            </motion.h1>
            <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground mb-8">
              Upload lecture videos, get accurate transcripts, and auto-generated MCQs to enhance learning and
              assessment.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/upload">
                  Upload Video
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl border border-border/50 bg-card">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
                alt="Video Learning Platform"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg w-48 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Progress</span>
                <span className="text-primary font-medium">75%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="bg-primary h-2 rounded-full"
                ></motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-6 -right-6 bg-card p-4 rounded-lg shadow-lg w-48 border border-border/50"
            >
              <div className="text-sm font-medium mb-1">MCQs Generated</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-2xl font-bold text-primary"
              >
                24
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
