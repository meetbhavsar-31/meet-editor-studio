import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Marquee from '@/components/sections/Marquee'
import About from '@/components/sections/About'
import ReelsShowcase from '@/components/sections/ReelsShowcase'
import LongFormShowcase from '@/components/sections/LongFormShowcase'
import ThumbnailGallery from '@/components/sections/ThumbnailGallery'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import Timeline from '@/components/sections/Timeline'
import Skills from '@/components/sections/Skills'
import Stats from '@/components/sections/Stats'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <ReelsShowcase />
      <LongFormShowcase />
      <ThumbnailGallery />
      <Services />
      <Projects />
      <Timeline />
      <Skills />
      <Stats />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
