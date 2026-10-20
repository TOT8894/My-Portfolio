import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Specializations from '../components/portfolio/Specializations';
import Experience from '../components/portfolio/Experience';
import Projects from '../components/portfolio/Projects';
import Certificates from '../components/portfolio/Certificates';
import Contact from '../components/portfolio/Contact';

export default function PortfolioHome() {
  return (
    <main>
      <Hero />
      <About />
      <Specializations />
      <Experience />
      <Projects />
      <Certificates />
      <Contact />
    </main>
  );
}
