const Header = () => {
    const scrollToAbout = () => {
        document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="header">
            <div className="header-text">
                <h1>Hey, I'm Chok!</h1>
            </div>

            <p className="header-tagline">
                I'm a <span className="accent">Computer Science & Artificial Intelligence</span> student who's had the chance to work on some genuinely exciting problems across five internships, with my sixth starting this fall!
            </p>

            <button className="scroll-cue" onClick={scrollToAbout} aria-label="Scroll to About section">
                <span>You Can Dig Through My Work Below</span>
            </button>
        </div>
    )
}

export default Header;
