import mountain from "../assets/mountain.svg";
import mountain2 from "../assets/mountain2.svg";

const Header = () => {
    return (
        <div className="header">
            <div className="header-text">
                <h1>Chok</h1>
                
            </div>
            
            <img src={mountain} className="mountain" />
            <img src={mountain2} className="mountain2" />
        </div>
    )
}

export default Header;