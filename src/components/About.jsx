const About = () => {
    return (
        <div className="about" id="about">
            <div className="about-container">
                <h1 className="reveal">About</h1>

                <h2 className="about-bio reveal">
                    Currently, I study at Florida Atlantic University, where I will be graduating this December with my Bachelor of Science in Computer Science and Minor in Artificial Intelligence.

                    What drew me to software engineering is how much range it has, there's almost no limit to what you can build or the impact it can have. There's something incredibly satisfying to me about being the person behind the scenes who keeps a system running so other people can have a great experience on the other end.


                </h2>

                <div className="about-cards-container reveal-group">
                    <div className="about-card coral-1">
                        <h2>Education</h2>
                        <h3>Florida Atlantic University</h3>
                        <p>B.S. In Computer Science, AI Minor</p>

                    </div>
                    <div className="about-card coral-1">
                        <h2>Certifications</h2>
                        <p>AWS Certified Cloud Practioner</p>
                        <p>Lean Six Sigma Yellow Belt</p>
                        
                    </div>
                    <div className="about-card coral-1">
                        <h2>Core Skills</h2>
                        <p>Languages: Python, JavaScript, TypeScript, Java, SQL</p>
                        <p>Frameworks: React.js, Angular, Flask, Node.js</p>
                        <p>Data: PostgreSQL, MongoDB, OpenSearch</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;