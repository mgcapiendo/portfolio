import skeleton from "../assets/skeleton.png";

const Header = () => {
    return (
        <div className="header">
            <h1>I want to build technology that creates wonder.</h1>
            <h2>Check out my About to see who I am, or read about my Experiences and Projects, or you can also find how to Contact me!</h2>

            {/* <h2>Hey! I'm Manuel, an aspiring software engineer, and I want to build technology that inspires and creates wonder. 
            My journey began in middle school with an engineering program and has continued through college, 
            where I study computer science and artificial intelligence. 
            Along the way, my interests in process improvement and enterprise design have taught me to adapt, learn quickly, 
            and collaborate with great people. I'm determined to contribute to projects that push technology forward 
            while exploring opportunities to learn, grow, and make the most impact.
            </h2> */}

            {/* really cool skeleton i want to incorporate later */}

            <img src={skeleton} />
        </div>
    )
}

export default Header;