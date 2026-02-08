import about1 from "../assets/about1.svg";
import about2 from "../assets/about2.svg";

const About = () => {
    return (
        <div className="about">
            <img src={about1} className="about1"/>
            <img src={about2} className="about2"/>
            
            <div className="about-container">
                <h1>About</h1>

                <h2>Hey! I'm Manuel, an aspiring software engineer, and I want to build technology that inspires and creates wonder. 
                My journey began in middle school with an engineering program and has continued through college, 
                where I study computer science and artificial intelligence. 
                Along the way, my interests in process improvement and enterprise design have taught me to adapt, learn quickly, 
                and collaborate with great people. I'm determined to contribute to projects that push technology forward 
                while exploring opportunities to learn, grow, and make the most impact.
                </h2>
            </div>
        </div>
    )
}

export default About;