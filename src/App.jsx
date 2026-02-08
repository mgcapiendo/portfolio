import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Fossil from './components/Fossil';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';


const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Fossil / >
      <Experience />
      <Projects />
      <Contact />
    </div>
  )
}

export default App
