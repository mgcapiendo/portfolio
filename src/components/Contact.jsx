const Contact = () => {
    return (
        <div className="contact" id="contact">

            <div className="contact-card">
                <h1>Contact</h1>
                
                <div className="contact-bubbles">

                    <div className="socials">
                        <div className="bubble">
                            <a href="https://linkedin.com/in/capiendo" target="_blank" rel="noreferrer">Linkedin</a>
                        </div>
                        
                        <div className="bubble">
                            <a href="https://github.com/mgcapiendo" target="_blank" rel="noreferrer">GitHub</a>
                        </div>
                    </div>

                    <div className="bubble-email">
                        <h3>manuelgcapiendo@gmail.com</h3>
                    </div>

                    <div>
                        <a href="/ManuelCapiendo_Resume.pdf" target="_blank" rel="noreferrer" className="resume">
                            <h3>View Full Resume</h3>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact;