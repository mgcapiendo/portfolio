const Navbar = () => {

    const scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="navbar">
            <div className="navbar-links">
                <span onClick={() => scrollToSection("about")}>About</span>
                <span onClick={() => scrollToSection("experience")}>Experience</span>
                <span onClick={() => scrollToSection("projects")}>Projects</span>
                <span onClick={() => scrollToSection("contact")}>Contact</span>
            </div>
        </div>
    )
}

export default Navbar;