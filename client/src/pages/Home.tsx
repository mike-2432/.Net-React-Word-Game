import Footer from '../components/Footer';
import { FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// HOME PAGE //
const Home = () => {
    const title = ["W","O","R","D"];
    const titleSec = ["S","M","I","T","H"];
    return (
        <>
            <div className="page-container">

                <div className="homepage-title-container">
                    <div className="homepage-title">
                        {title.map((tile, index)=> {
                            return <h1 className="homepage-tile alternative-clr" key={index}>{tile}</h1>
                        })}
                    </div>
                    
                    <div style={{marginLeft:"2.25rem"}} className="homepage-title">
                        {titleSec.map((tile, index)=> {
                            return <h1 className="homepage-tile alternative-clr-sec" key={index}>{tile}</h1>
                        })}
                    </div>
                </div>

                <div className="homepage-mode-container">
                        <Link className="mode-container" to="/game">
                            <h1>Classic Game</h1>
                            <div className="mode-green"><FaChevronRight/></div>
                        </Link>
                        <Link className="mode-container" to="/construction">
                            <h1>Word-Smith Game</h1>
                            <div className="mode-green"><FaChevronRight/></div>
                        </Link>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home
