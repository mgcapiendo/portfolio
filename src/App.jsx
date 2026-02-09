import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';

import { useEffect } from 'react';


const App = () => {
useEffect(() => {
  function handleScroll() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const p = Math.min(scrollY / vh, 1);

    const mt1 = document.querySelector('.mountain');
    const mt2 = document.querySelector('.mountain2');
    const ab1 = document.querySelector('.about1');
    const ab2 = document.querySelector('.about2');

    if (mt1) mt1.style.transform = `translateX(${p * 56}vw)`;
    if (mt2) mt2.style.transform = `translateX(-${p * 56}vw)`;
    if (ab1) ab1.style.transform = `translateX(-${p * 56}vw)`;
    if (ab2) ab2.style.transform = `translateX(${p * 56}vw)`;
  }

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </div>
  )
}

export default App
