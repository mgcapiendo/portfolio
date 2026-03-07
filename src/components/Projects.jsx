const Projects = () => {
    return (
        <div className="projects">
            <div className ="projects-container">

                <h1>Projects</h1>

                <h2>Personal</h2>
                <div className="projects-cards-holder-personal">
                    <div className="projects-card">
                        <h2>Theme Park Ticketing System</h2>
                        <h3>React, Flask, PostgreSQL, Selenium</h3>
                        <p>Lorem Ipsum Something Something</p>
                    </div>
                    <div className="projects-card">
                        <h2>Disney Emissions Dashboard</h2>
                        <h3>JavaScript, Data Visualization</h3>
                        <p>Lorem Ipsum Something Something</p>
                    </div>
                    <div className="projects-card">
                        <h2>Voice-Controlled Robot</h2>
                        <h3>Python, Arduino, Gemini LLM</h3>
                        <p>Lorem Ipsum Something Something</p>
                    </div>
                </div>
                
                <h2>Hackathons</h2>
                <div className="projects-cards-holder-hackathons">
                    <div className="projects-card">
                        <h2>Mycobime Research Simulator</h2>
                        <h3>Python, Data Visualization</h3>
                        <p>Lorem Ipsum Something Something</p>
                    </div>
                    <div className="projects-card">
                        <h2>AI-Powered Waste Routing</h2>
                        <h3>Python, Swarm Intelligence </h3>
                        <p>Lorem Ipsum Something Something</p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Projects;