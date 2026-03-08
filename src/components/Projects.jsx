const Projects = () => {
    return (
        <div className="projects" id="projects">
            <div className ="projects-container">

                <h1>Projects</h1>

                <h2>Personal</h2>
                <div className="projects-cards-holder-personal">
                    <div className="projects-card">
                        <h2>Theme Park Ticketing System</h2>
                        <h3>React, Flask, PostgreSQL, Selenium</h3>
                        <p>
                            Built a full-stack ticketing platform for simulated theme park "Dino World" with a React frontend, Flask backend, and PostgreSQL database, handling reservations, user authentication, and real-time availability across all park offerings and integrating Selenium automated testing to validate reliability across all end-to-end user flows.
                        </p>
                    </div>
                    <div className="projects-card">
                        <h2>Disney Emissions Dashboard</h2>
                        <h3>JavaScript, Data Visualization</h3>
                        <p>
                            Built an interactive data visualization dashboard tracking Disney's Scope 1-3 carbon emissions and year-over-year progress toward their 2030 net zero targets, incorporating an integrated petition registration feature to drive stakeholder engagement and connect data storytelling directly to real-world sustainability advocacy.
                        </p>
                    </div>
                    <div className="projects-card">
                        <h2>Voice-Controlled Robot</h2>
                        <h3>Python, Arduino, Gemini LLM</h3>
                        <p>
                            Integrated Google's Gemini LLM with Arduino hardware to build a voice-interactive robot capable of real-time speech transcription and natural language command processing, enabling fluid conversational control of a physical robotic system through end-to-end integration of AI inference, audio processing, and microcontroller actuation.
                        </p>
                    </div>
                </div>
                
                <h2>Hackathons</h2>
                <div className="projects-cards-holder-hackathons">
                    <div className="projects-card">
                        <h2>NEXTSteps</h2>
                        <h3>React, Python, Data Visualization</h3>
                        <p>Led a team of interns during the NEXT100 Hackathon to build NEXTSteps, an internal career support tool that helps employees explore potential career paths by leveraging the organizational chart to identify colleagues with similar skills, backgrounds, and role transitions as a guide for their next steps, ultimately being voted Fan Favorite with a similar solution already greenlit for development by the company.</p>
                    </div>
                    <div className="projects-card">
                        <h2>Mycobime Research Simulator</h2>
                        <h3>Python, Data Visualization</h3>
                        <p>Collaborated in an interdisciplinary team to develop a Python-based visualization and simulation tool for researching the fungal component of the human microbiome and its correlations with human longevity, bridging the gap between complex biological research data and an accessible, interactive software experience.</p>
                    </div>
                    <div className="projects-card">
                        <h2>AI-Powered Waste Routing</h2>
                        <h3>Python, Swarm Intelligence </h3>
                        <p>
                            Competed solo against multi-person teams to design and build an AI-driven Ant Colony Optimization system that reduced waste management routing inefficiencies by 10% using swarm intelligence modeling, placing 2nd overall and demonstrating the ability to independently scope, architect, and deliver a functional AI system under time pressure.
                        </p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Projects;