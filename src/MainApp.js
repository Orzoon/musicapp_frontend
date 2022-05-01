import React, { useEffect, useState, useReducer, useRef} from "react";
import { Link, Outlet } from "react-router-dom";
//import SpotifyWebApi from "spotify-web-api-js";
import appReducer, {InitialState} from "./appReducer";
// context
import { spotifyApi } from "./helper";
import { AppContext } from "./context";
import NavPlaylist from "./subComponents/navPlaylist";
import MusicPlayer from "./Components/MusicPlayer";

// hooks
import {useWindowWidthResize} from "./hooks"
// icons
import {
    FaSpotify, 
    FaPlus,
    FaHome,
    FaSearch, 
    FaHeart,
    FaCaretDown} from "react-icons/fa";
import {MdClose} from "react-icons/md"
import {BiLibrary} from "react-icons/bi";
import {AiOutlinePlus} from "react-icons/ai"

// importing the styles
import "./styles/MainApp.scss";

const _token = "BQCkzpsII1G-2qzBR0RG5M7LF7Vgh1606NnZM-1PP7d2Wds6Z0v-GJ34ApcJZdYlvtFzxUXbZbXDxfNiNsitowjBeZ7YOvC0tVHGu0YPXa-nZyVjadtPPdc3Q4k2g5cER9cvCP6KjUkLMk_MN2desv2amljb-Bi2FpgtUmHF6n4TCA2d4LuXVykYOPQ7qQpTZz75e00Xv6NqFtkjqCB9HJvPJg54I17UtgJ000F267GSd9AIamVyHSID9cUUIF2zvk3P8josmEMRb5-dRX8gQbKpi_5Zsyl_PRiRE5wJnxA";


export default function MainApp(){
    const {windowWidth} = useWindowWidthResize();
    const navRef = useRef(null);
    const headerRef = useRef(null);
    const [{
        user,
        home,
        playlists, 
        musicPlayer
    }, dispatch] = useReducer(appReducer, InitialState);

    const [token, setToken] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [mbl, setMbl] = useState(null);
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
            // spotifyApi.getNewReleases()
            // .then(_newRelease => {
            //     const _freshNewMusic = {
            //         hometitle: "Fresh New Music",
            //         tracks: _newRelease.albums.items
            //     }
            //     dispatch({type: "SET_FRESH_NEW_MUSIC", payload: _freshNewMusic})
            // })

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
            // --> pop
                        //--> MOOD
                        spotifyApi.getCategoryPlaylists("pop")
                        .then(pop => {
                           // console.log("mood", mood)
                            const _pop = {
                                hometitle: "Pop",
                                tracks: pop.playlists.items 
                                //tracks
                            }
                            dispatch({type: "SET_POP", payload: _pop})
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
    //--> NOTE
    /*shift this to nav*/
    useEffect(() => {
        document.addEventListener("click", navOutSideClickHandler)
        return () => document.removeEventListener("click", navOutSideClickHandler)
    })

    useEffect(() => {
        if(windowWidth >= 768){
            setMbl(false)
            setNavOpen(false);
            return 
        }
        setMbl(true)
        setNavOpen(false);
    }, [windowWidth])

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
                                <div className = "MA_headerProfileBtnIMGCON">
                                    {user && user.images.length >= 1 &&
                                        <img src = {user.images[0].url} alt = "user profile"/>
                                    } 
                                        {/* replace fa Icon */}
                                    {user && user.images.length <= 0 &&
                                        "I"
                                    }
                                </div>
                                <div className = "MA_headerProfileBtnNMCON">
                                    <h1>
                                        {user && user.display_name}
                                    </h1>
                                </div>
                                <div className = "MA_headerProfileBtnIIconCON">
                                   <FaCaretDown/>
                                </div>

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

                {/* -mbl Navigation-- */}
                
                {mbl && 
                <nav 
                    className = {navOpen ? "MA_nav navCommon navOpen": "MA_nav navCommon navClose"}
                    ref={navRef}>
                    <div className = "MA_navTopDiv">
                            <button 
                                onClick={(e) => {setNavOpen(false)}}
                                className = "MA_navCloseBtn">
                               <MdClose />
                            </button>
                            <button className = "MA_ProfileBTN">
                               <img/>
                               <h2></h2>
                            </button>
                    </div>
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
                            <div className = "MA_navPLusIcon"><AiOutlinePlus size={15}/></div>
                            <Link to="yourlibrary" className="MA_navLikeda">Create Playlist</Link>
                        </li>
                        <li>
                            <div className = "MA_navHeartIcon"><FaHeart/></div>
                            <Link to="yourlibrary" className="MA_navLikeda">Liked Songs</Link>
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


                </nav>}
                {/* -Main- Navigation-- */}
                {!mbl &&
                <nav 
                    className ="navCommon MA_navMain"
                    ref={navRef}>
                    <div className = "MA_navTopDiv">
                        <div className = "MA_logoTextContainer">
                            <div className= "MA_logoContainer">
                                <FaSpotify size={42}/>
                            </div>   
                            <p className = "MA_logoText">
                                Spotify
                            </p>
                        </div>
                    </div>
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
                            <div className = "MA_navPLusIcon"><AiOutlinePlus size={15}/></div>
                            <Link to="yourlibrary" className="MA_navLikeda">Create Playlist</Link>
                        </li>
                        <li>
                            <div className = "MA_navHeartIcon"><FaHeart/></div>
                            <Link to="yourlibrary" className="MA_navLikeda">Liked Songs</Link>
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


                </nav>}
        
                <AppContext.Provider value ={{
                    user,
                    home,
                    playlists,
                    musicPlayer,
                    dispatch
                    }}> 

                {/* OUTLET */}
                <div className = "MA_outletContainer">
                        <Outlet/>
                </div>


                {/* FOOTER-- MUSIC PLAYER */}
                <MusicPlayer token = {token}/>
                </AppContext.Provider>                
        </div>
        
    )
}



export {
    spotifyApi
}