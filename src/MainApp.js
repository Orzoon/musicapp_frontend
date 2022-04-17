import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
// icons
import {FaSpotify} from "react-icons/fa"

import { checkAuth } from "./helper";
// importing the styles
import "./styles/MainApp.scss";




const _token = "BQCGSyRpm2hlEEF2RmJAB6p1ArlRYQVLmnzn_mvl9ZZcNRONxAA6XV6cAFfADUcKIuryemeDrfWswWag8xRDRkO2zUZTOcZp_cK03wqE8rW1Zlq-PFIHbOBJfvSCZeUDWvgAy0JXRyJr367-oMMZAqp1CgF9zoXlEbcbqCE_e-3enlA0ZtjB0gUJ2-P0tM1QH9dRtrleLz7zfSUL1IOfVd_71uWa-cxH0QGzPyKVt-thVTtjuGLa0rQxRu0Fz6smogG2yoYB-g";


const spotifyApi = new SpotifyWebApi();
export default function MainApp(){


    const [token, setToken] = useState(null);
    // spotify variables

    const [user, setUser] = useState("")
    useEffect(() => {
        // setting manually for now
        setToken(_token)
        spotifyApi.setAccessToken(_token)
        if(token){
           spotifyApi.getMe().then(user=> console.log(user))
        }
    },  [token])


    return( 
        <div className = "MainApp_container">
                {/* --Main_Header-- */}
                <header className = "MA_header">
                    {/* --LOGO_textContainer--- */}
                    <div className = "MA_logoTextContainer">
                        <div className= "MA_logoContainer">
                            <FaSpotify size={42}/>
                        </div>   
                        <p className = "MA_logoText">
                            Spotify
                        </p>
                    </div>

                    {/* --Profile -- */}
                    <button className = "MA_headerProfile">
                            <img src = "" alt = ""/>
                    </button>
                    {/*--Mobile--HAM-menu-- */}
                    <div className = "MA_mobileMenu">
                        <div className="MA_mobileMenuLine1"></div>
                        <div className="MA_mobileMenuLine2"></div>
                    </div>
                </header>

                {/* -Main Navigation-- */}
                <nav className = "MA_nav">
                    <ul>
                        <li>
                            <Link to="home">Home</Link>
                        </li>
                        <li>
                            <Link to="search">Search</Link>
                        </li>
                        <li>
                            <Link to="yourlibrary">Your library</Link>
                        </li>
                    </ul>
                </nav>


                {/* OUTLET */}
                <div className = "MA_outletContainer">
                    <Outlet/>
                </div>
        </div>
    )
}
