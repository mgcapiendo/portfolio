const About = () => {
    return (
        <div className="about" id="about">
            <div className="about-container">
                <h1 className="reveal">About</h1>

                <h2 className="about-bio reveal">
                    Currently, I study at Florida Atlantic University, 
                    where I will be graduating this December with my Bachelor of Science in Computer Science and Minor in Artificial Intelligence. 
                    What drew me to software engineering is how there's almost no limit to what you can build or the impact it can have.
                </h2>

                <div className="about-cards-container reveal-group">
                    <div className="about-card coral-1">
                        <h2>Education</h2>
                        <h3>Florida Atlantic University</h3>
                        <p>B.S. In Computer Science, AI Minor</p>
                        <p>Expected December 2026</p>

                    </div>
                    <div className="about-card coral-1">
                        <h2>Certifications</h2>
                        <p>AWS Certified Cloud Practitioner</p>
                        <p>Lean Six Sigma Yellow Belt</p>
                        
                    </div>
                    <div className="about-card coral-1">
                        <h2>Core Skills</h2>
                        <p>Languages: Python, TypeScript, JavaScript, Java, SQL</p>
                        <p>Frameworks: React, Vue, Angular, Node.js/Express, Flask</p>
                        <p>AI/ML: PyTorch, scikit-learn, pandas, NumPy, OpenAI API</p>
                        <p>Data: PostgreSQL, OpenSearch, SQL Server, MongoDB</p>
                        <p>Testing: Vitest, Playwright, Selenium, Appium</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;