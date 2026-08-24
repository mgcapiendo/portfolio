const Projects = () => {
    return (
        <div className="projects" id="projects">
            <div className ="projects-container">

                <h1 className="reveal">Projects</h1>
                
                <h2 className="reveal">Hackathons</h2>
                <div className="projects-cards-holder-hackathons reveal-group">
                    <div className="projects-card coral-3a">
                        <h2>NEXTSteps 🏆</h2>
                        <h3>React, Python, Data Visualization</h3>
                        <p>Led a 6-person team of IT interns to design NEXTSteps, an internal career navigation tool that uses the company's organizational chart to identify employees with similar skills and backgrounds, suggesting informed career path options.</p>
                        <ul>
                            <li>
                                Directed the product vision and overall design of the app, then matched each teammate to the role best suited to their strengths, assigning technical, research, and presentation work.
                            </li>
                            <li>
                                Kept the team on track throughout the week while building the pitch presentation and script, including a Star Wars-themed narrative to make the concept memorable and engaging.
                            </li>
                        </ul>
                    </div>
                    <div className="projects-card coral-3a">
                        <h2>Mycobime Research Simulator</h2>
                        <h3>Python, Data Visualization</h3>
                        <p>Formed and led an interdisciplinary team (psychology, public health, and computer science) to research the fungal component of the human microbiome and its correlations with longevity.</p>
                        <ul>
                            <li>
                                Recruited and led a 4-person team across three different fields of study, coordinating the technical build alongside teammates' research contributions.
                            </li>
                            <li>
                                Built a Python-based visualization and simulation tool using Tkinter, with a GUI depicting a simulated view of the fungal microbiome within the human body.
                            </li>
                        </ul>
                    </div>
                    <div className="projects-card coral-3a">
                        <h2>AI-Powered Waste Routing 🏆</h2>
                        <h3>Python, Swarm Intelligence </h3>
                        <p>
                            Built and presented solo against team-based competitors, placing 2nd overall. Started this project shortly after finishing my first internship at Sparton, and was motivated to apply what I was learning in my second year of Computer Science.
                        </p>
                        <ul>
                            <li>
                                Proposed the core idea of modeling garbage truck routing and waste-to-energy facilities after how ants forage for food by applying Ant Colony Optimization to real-world waste collection logistics.
                            </li>
                            <li>
                                Built a Python-based visual demo showing how ACO-driven routing could improve fuel-to-waste pickup efficiency, aiming to maximize daily output for waste-to-energy production while reducing operational costs.
                            </li>
                        </ul>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Projects;