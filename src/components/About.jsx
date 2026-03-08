import about1 from "../assets/about1.svg";
import about2 from "../assets/about2.svg";

const About = () => {
    return (
        <div className="about" id="about">
            <img src={about1} className="about1"/>
            <img src={about2} className="about2"/>
            
            <div className="about-container">
                <h1>About</h1>

                <h2 className="about-bio">Hey! I'm Chok. I'm a student at Florida Atlantic University studying Computer Science and Artificial Intelligence. 
                    I'm interested in the design and development of Full-Stack applications and how AI can be integrated for new features.
                    I also enjoy the hardware side such as applications for Robotics or Extended Reality.
                    Currently, I intern at Universal Destinations & Experiences as a Software Quality Engineering Intern where I build
                    and maintain the systems that ensure Universal's apps work across web, mobile, and point-of-sale platforms worldwide.
                </h2>

                <div className="about-cards-container">
                    <div className="about-card">
                        <h2>Education</h2>
                        <h3>Florida Atlantic University</h3>
                        <p>B.S. In Computer Science, AI Minor</p>

                    </div>
                    <div className="about-card">
                        <h2>Certifications</h2>
                        <p>AWS Certified Cloud Practioner</p>
                        <p>Lean Six Sigma Yellow Belt</p>
                        
                    </div>
                    <div className="about-card">
                        <h2>Tech Stack</h2>
                        <p>Full-Stack Development</p>
                        <p>AI & Machine Learning</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;