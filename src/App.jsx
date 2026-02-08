import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Fossil from './components/Fossil';
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

    if (mt1) mt1.style.transform = `translateX(${p * 80}vw)`;
    if (mt2) mt2.style.transform = `translateX(-${p * 80}vw)`;
    if (ab1) ab1.style.transform = `translateX(-${p * 80}vw)`;
    if (ab2) ab2.style.transform = `translateX(${p * 80}vw)`;

    // const about = document.querySelector('.about');

    // if (about) about.style.transform = `translateY(${p * 80}vw)`;
  }

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      {/* <Fossil />
      <Experience />
      <Projects />
      <Contact /> */}
    </div>
  )
}

export default App
