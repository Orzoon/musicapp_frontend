import React, { useEffect, useState, useReducer, useRef} from "react";
import { Link, Outlet } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import appReducer, {InitialState} from "./appReducer";
// context
import { AppContext } from "./context";
import NavPlaylist from "./subComponents/navPlaylist";
// icons
import {FaSpotify} from "react-icons/fa"
import{FaHome} from "react-icons/fa"
import {FaSearch} from "react-icons/fa";
import{FaHeart} from "react-icons/fa"
import {BiLibrary} from "react-icons/bi";

// importing the styles
import "./styles/MainApp.scss";

const _token = "BQCq7oxi4t17v7N0BXTsu2wyrxSM6FHgADZfXaATvl2YcIb_Xsu7kcAEA1P_buHZEguU5BENwQ4rooj-HPG3gkEBUl0T3dIyAOK3zpzeExGwWnhf56YG_oQ43o8UnTyewrucwkPX8w5cwNZ5KHwCG_jfEdE63kG5k9B9iqTCeQSz7WFNpvNub5rxmwdKKys7KO2FQHxZU1N0BQnZmFeZGdAoiudMY47etDZ7-dG2KAEV2g4k1ywr_PQnSnvx6HmfNzVmoiWMaQ";
const spotifyApi = new SpotifyWebApi();

export default function MainApp(){
    const navRef = useRef(null);
    const headerRef = useRef(null);
    const [{
        user,
        home,
        playlists
    }, dispatch] = useReducer(appReducer, InitialState);

    const [token, setToken] = useState(null);
    const [navOpen, setNavOpen] = useState(false)
    useEffect(() => {

        //closing the nav on the click


        setToken(_token)
        if(token){
            spotifyApi.setAccessToken(_token)
            //getting user
            spotifyApi.getMe().then(user => dispatch({type:"SET_USER", payload: user}));

            /*---- HOME-----*/
            /*************/
            /******/
            //--> recently played tracks
            // spotifyApi.getMyRecentlyPlayedTracks()
            // .then(_tracks => {
            //     if(_tracks && _tracks.items && _tracks.items.length >0){
            //         const _recentlyPlayedData  = {
            //             hometitle:"Recently Played",
            //             tracks: _tracks.items
            //         }
            //         dispatch({type:"SET_RECENTLY_PLAYED", payload: _recentlyPlayedData})
            //     }
            // })

            //--> Fresh New Music
            spotifyApi.getNewReleases()
            .then(_newRelease => {
                const _freshNewMusic = {
                    hometitle: "Fresh New Music",
                    tracks: _newRelease.albums.items
                }
                dispatch({type: "SET_FRESH_NEW_MUSIC", payload: _freshNewMusic})
            })

            spotifyApi.getCategories()
            .then(cat => null)
            // toplists, mood, workout, chill, rock

            //--> MOOD
            spotifyApi.getCategoryPlaylists("mood")
            .then(mood => {
               // console.log("mood", mood)
                const _mood = {
                    hometitle: "Mood",
                    tracks: mood.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_MOOD", payload: _mood})
            })

            //--> workout
            spotifyApi.getCategoryPlaylists("workout")
            .then(workout => {
                const _workout = {
                    hometitle: "Workout",
                    tracks: workout.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_WORKOUT", payload: _workout})
            })

            // --> chill
            spotifyApi.getCategoryPlaylists("chill")
            .then(chill => {
                const _chill = {
                    hometitle: "Chill",
                    tracks: chill.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_CHILL", payload: _chill})
            })
            

            /*---- PLAYLISTS-----*/
            /*************/
            /******/
            
            // playlist array [items]
            spotifyApi.getMe()
            .then(user => {
                spotifyApi.getUserPlaylists(user.id)
                .then(playlists => {
                    dispatch({type:"SET_PLAYLIST", payload: playlists.items})
                })
            })
            


            
        }
    },  [token])


    // outsideClick
    useEffect(() => {
        document.addEventListener("click", navOutSideClickHandler)
        return () => document.removeEventListener("click", navOutSideClickHandler)
    })

    function navOutSideClickHandler(e){
        if(!navRef.current.contains(e.target) && !headerRef.current.contains(e.target)){
            setNavOpen(false)
        }
    }

    function HandleNavOpenClose(e){
        e.preventDefault();
        setNavOpen(true)
    }   


    return( 

        <div className = "MainApp_container">
                {/* --Main_Header-- */}
                <header ref = {headerRef} className = "MA_header">
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
                    <div className = "MA_headerProfileBtnNav">
                            <button className = "MA_headerProfileBtn">
                                {/* default Icon or Image */}
                               {user && user.images.length >= 1 &&
                                <img src = {user.images[0].url} alt = "user profile"/>
                               } 
                                {/* replace fa Icon */}
                               {user && user.images.length <= 0 &&
                                 "I"
                               }
                            </button>
                            {/* ProfileName */}
                            <ul className = "MA_headerProfileNav">
                                {/* Link */}
                                <li>Profile</li>

                                {/* Button*/}
                                <li>Logout</li>
                            </ul>
        
                    </div>
                    {/*--Mobile--HAM-menu-- */}
                    <button 
                        className = "MA_mobileMenu"
                        onClick={(e) => HandleNavOpenClose(e)}
                    >
                        <div className="MA_mobileMenuLine1"></div>
                        <div className="MA_mobileMenuLine2"></div>
                        <div className="MA_mobileMenuLine3"></div>
                    </button>
                </header>

                {/* -Main Navigation-- */}
                <nav
                    ref={navRef} 
                    className = {navOpen ? "MA_nav navOpen": "MA_nav navClose"}>
                    <ul className = "MA_navTop">
                        <li>
                            <div><FaHome/></div>
                            <Link to="home">Home</Link>
                        </li>
                        <li>
                            <div><FaSearch/></div>
                            <Link to="search">Search</Link>
                        </li>
                        <li>
                            <div><BiLibrary/></div>
                            <Link to="yourlibrary">Your Library</Link>
                        </li>
                        <li className = "MA_navTopPlaylist_gap">

                        </li>
                        <li>
                            <div className = "MA_navHeartIcon"><FaHeart/></div>
                            <Link to="yourlibrary">Liked Songs</Link>
                        </li>
                    </ul>
                    {/* bottom nav --playlists*/}
                    <ul className = "MA_navBot">
                        {playlists.map((item, index) => {
                            return(
                                <NavPlaylist key ={item.id} item = {item}/>
                            )
                         })
                        
                        }
                    </ul>


                </nav>

            
                {/* OUTLET */}
                <div className = "MA_outletContainer">
                    <AppContext.Provider value ={{
                        user,
                        home,
                        dispatch
                        }}>
                        <Outlet/>
                    </AppContext.Provider>
                </div>
        </div>
        
    )
}
