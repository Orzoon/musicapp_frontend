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

const _token = "BQBU2AMQ8wTkKMyQr0Aj4R6ASnbp9ucClhI4ghccZDYBcjxKbOx4vlib-ploixoOf0roQjhUUBH8T9K-4NZLLv9MG38MgRfirqB8jj6wzCaxSzZmraLObXGyTXHEPoCGCrK2FiKog1AiiJJAqKS00lb1hTIz7ubtbLjYYAkIF01tuma4P__PN9in6fwqCOeKGOkoCw53ps4bQf_3LxN_zGqLYp4HAL5JjensYuu_0ALeTeTl4ucHF9ySBegGbFQkrajbX0rqdPxL8awYqb_GHatciv-rClTBCygzpA_b1Qw";


export default function MainApp(){
    const {windowWidth} = useWindowWidthResize();
    const navRef = useRef(null);
    const logoutULRef = useRef(null)
    const headerRef = useRef(null);
    const btnRef = useRef(null);
    const [{
        user,
        home,
        playlists, 
        musicPlayer
    }, dispatch] = useReducer(appReducer, InitialState);

    const [token, setToken] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [mbl, setMbl] = useState(null);
    const [logout, setLogout] = useState(false);
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
        if(logout){
            if(logoutULRef && !logoutULRef.current.contains(e.target) && !btnRef.current.contains(e.target)){
                    setLogout(false)
            }
        }
    }

    function HandleNavOpenClose(e){
        e.preventDefault();
        setNavOpen(true);
        setLogout(false);
    }   

    function logoutHandler(){

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
                            <button
                                ref = {btnRef}
                                onClick = {(e) => {
                                    setLogout(!logout)
                                }} 
                                className = "MA_headerProfileBtn">
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

                            {/* logout UL */}

                            {logout && 
                            <ul 
                                ref = {logoutULRef}
                                className = "MA_headerProfileNavYUL">
                                <li>
                                    <button 
                                        className = "MA_logoutButton"
                                        onClick={(e) => {logoutHandler(e)}}
                                    >
                                        Log out
                                    </button>
                                </li>
                            </ul>
                            }
                           
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