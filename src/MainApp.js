import React, { useEffect, useState, useReducer, useRef} from "react";
import {Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
//import SpotifyWebApi from "spotify-web-api-js";
import appReducer, {InitialState} from "./appReducer";
// context
import { spotifyApi } from "./helper";
import { AppContext } from "./context";
// importing loader
import {MainAppLoader} from "./subComponents/loader"
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
import {MdClose} from "react-icons/md";
import {BsPerson} from "react-icons/bs";
import {BiLibrary} from "react-icons/bi";
import {AiOutlinePlus} from "react-icons/ai"

// importing the styles
import "./styles/MainApp.scss";

const _token = "BQAkFDIemX8hPtaKj6565NJyprl4e9d-sAJseS1kXkmQF3D46UANhEoaqRgnWcvRvtUKEsDwD5dpbblKqdoOpOtjHp1tz4OEWgz5xGd0W9L3a9XRP7dGy-4a6vOAt45tAoFq61vHcxJ-XWR9J00HwHjPxqI_rpK5bW8X_lUjk0_Lu43Ph6r30ZTA6lqmiUrNLfO9Fo4sFyPZruRhtXzEKspxx-UgeXXiz60jw19jzgk-5SC0ttPII0p9lbqKAMZUO3tfkKpOls6fRdWkaT_S6cqRgjcK_cGyP9Gf1L9o5pI";


export default function MainApp(){
    const currentlocation = useLocation()
    const {windowWidth} = useWindowWidthResize();
    const navRef = useRef(null);
    const logoutULRef = useRef(null)
    const headerRef = useRef(null);
    const btnRef = useRef(null);
    const navigate = useNavigate()
    const [{
        user,
        home,
        search,
        playlists,
        likedSongs,
        musicPlayer,
        notification,
        loadingDataNames
    }, dispatch] = useReducer(appReducer, InitialState);

    const [token, setToken] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [mbl, setMbl] = useState(null);
    const [logout, setLogout] = useState(false);
    const [createPlaylistBool, setCreatePlaylistBool] = useState(false);
    const [playlistNameNumber, setPlaylistNameNumber] = useState(1);
    const [navLikedBool,setLikedNavBool] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // checking for the cookies and the token


        //closing the nav on the click
        setToken(_token)
        if(token){
            spotifyApi.setAccessToken(_token)
            //getting user
            spotifyApi.getMe().then(user => {
                dispatch({type:"SET_USER", payload: user})
                dispatch({type: "SET_LOADINGDATA", payload:"user"})
            });

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
                dispatch({type: "SET_LOADINGDATA", payload:"mood"})
            })
            // --> pop
            spotifyApi.getCategoryPlaylists("pop")
            .then(pop => {
                // console.log("mood", mood)
                const _pop = {
                    hometitle: "Pop",
                    tracks: pop.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_POP", payload: _pop})
                dispatch({type: "SET_LOADINGDATA", payload:"pop"})
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
                dispatch({type: "SET_LOADINGDATA", payload:"workout"})
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
                dispatch({type: "SET_LOADINGDATA", payload:"chill"})
            })
            // ------->
            spotifyApi.getCategoryPlaylists("hiphop")
            .then(hiphop => {
                const _hiphop = {
                    hometitle: "Hip-hop",
                    tracks: hiphop.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_HIPHOP", payload: _hiphop})
                dispatch({type: "SET_LOADINGDATA", payload:"hiphop"})
            })
            
            spotifyApi.getCategoryPlaylists("wellness")
            .then(wellness => {
                const _wellness = {
                    hometitle: "Wellness",
                    tracks: wellness.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_WELLNESS", payload: _wellness})
                dispatch({type: "SET_LOADINGDATA", payload:"wellness"})
            })

            spotifyApi.getCategoryPlaylists("rock")
            .then(gaming => {
                const __gaming = {
                    hometitle: "Rock",
                    tracks: gaming.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_GAMING", payload: __gaming})
                dispatch({type: "SET_LOADINGDATA", payload:"rock"})
            })

            spotifyApi.getCategoryPlaylists("party")
            .then(party => {
                const _party = {
                    hometitle: "Party",
                    tracks: party.playlists.items 
                    //tracks
                }
                dispatch({type: "SET_PARTY", payload: _party})
                dispatch({type: "SET_LOADINGDATA", payload:"party"})
            })


            /*---- PLAYLISTS-----*/
            /*************/
            /******/
            spotifyApi.getMySavedTracks({limit: 20})
            .then(savedTracks =>{
                //--> savedTracks ---> tracks, totalNO
                
                const _tracksArray = savedTracks.items.reduce((accumulator, item) => {
                    return [...accumulator, item.track]
                }, [])
                const _itemsIdArray = _tracksArray.reduce((accumulater, item) => {
                    return [...accumulater, item.id]
                }, [])
                const _savedTracksData = {
                    total: savedTracks.total,
                    items: _tracksArray,
                    itemsIdArray:_itemsIdArray 
                } 
                dispatch({type: "SET_SAVEDTRACKS", payload: _savedTracksData})
                dispatch({type: "SET_LOADINGDATA", payload:"likedSongs"})
            })
            // playlist array [items]
            spotifyApi.getMe()
            .then(user => {
                spotifyApi.getUserPlaylists(user.id)
                .then(playlists => {
                    dispatch({type:"SET_PLAYLIST", payload: playlists.items})
                    dispatch({type: "SET_LOADINGDATA", payload:"playlists"})
                })
            })

            // getting search
            spotifyApi.getCategories({limit: 50})
            .then(_data => {
                    if(!_data){
                        throw new Error("_no Data")
                    }
                    const searchCategoriesID = [
                        "mood", 
                        "rock", 
                        "pop", 
                        "chill", 
                        "party", 
                        "wellness", 
                        "workout", 
                        "hiphop", 
                        "rnb", 
                        "gaming"]
                    const _array = _data.categories.items;
                    const _FilteredArray = _array.reduce((accumulator, item, index) => {
                        const includes =  searchCategoriesID.includes(item.id)
                        if(includes){
                                   accumulator = [...accumulator,{
                                       id: item.id,
                                       name: item.id,
                                       href: item.href,
                                       image: item.icons[0].url
                                   }]
                            }

                            return accumulator
                    }, [])  
                    
                    // Dispatching search
                    //(_FilteredArray)
                    dispatch({type: "SET_SEARCH", payload: _FilteredArray})
                    dispatch({type: "SET_LOADINGDATA", payload:"search"})
                })
            .catch(error => {
            // later on
            })

            
        }
       
    },  [token])

    useEffect(() => {
        const dataToBeChecked = [
            "user",
            "likedSongs",
            "playlists",
            "search",
            "mood",
            "pop",
            "workout",
            "chill",
            "hiphop",
            "wellness",
            "rock",
            "party"
        ]

        const exists = dataToBeChecked.every(item => loadingDataNames.includes(item));
        if(exists){
            // all data loaded
            setLoading(false)
        }
    }, [loadingDataNames])

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

    useEffect(() => {
        const location = window.location.href.split("/");
        const length = location.length;
        if(location[length-1] ==="likedsongs" && location[length-2] === "playlist" && location[length-3] === "app"){
            setLikedNavBool(true)
        }else {
            setLikedNavBool(false)
        }
        if(currentlocation.pathname ==="/app"){
            navigate("/app/home")
        }
    }, [window.location.href])

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

    function createPlaylistHandler(e){
        setCreatePlaylistBool(true);
        // creating the playlist
        spotifyApi.createPlaylist(user.id, {name: `New Playlist #${playlistNameNumber}`})
        .then(newPlaylist => {
            setPlaylistNameNumber(playlistNameNumber+1);
            setCreatePlaylistBool(false);
            // new playlist list
            const _newPlaylists = [...playlists, newPlaylist]
            dispatch({type:"SET_PLAYLIST", payload: _newPlaylists})
            dispatch({type: "SET_NOTIFICATION", payload:[...notification, {
                id: `${newPlaylist.id}created`,
                message: "Playlist Created"
            }]});
            navigate("/app/playlist/"+newPlaylist.id)
            //closing the nav
            setTimeout(() => {
                setNavOpen(false)
            },250)

            //setNavOpen(false)
        })
        .catch(error => {
           setCreatePlaylistBool(false);
        })
    }

    function logoutHandler(){
    }
    if(loading){
        return <MainAppLoader/>
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
                                    {user && user.images.length > 0 &&
                                        <img src = {user.images[0].url} alt = "user profile"/>
                                    } 
                                    {/* replace fa Icon */}
                                    {user && user.images.length <= 0 &&
                                        <BsPerson/>
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
                            <NavLink    to="home" 
                                        className={({isActive}) => isActive ? "MA_navLink MA_navLinkActive" : "MA_navLink"}>
                                <span className = "span_navIcon"><FaHome/></span>    
                                <span className = "span_navText">Home</span>
                            </NavLink>
                        </li>
                        <li>
                            {/* <div><FaSearch/></div>
                            <Link to="search">Search</Link> */}
                            <NavLink    to="search" 
                                       className={({isActive}) => isActive ? "MA_navLink MA_navLinkActive" : "MA_navLink"}>
                                <span className = "span_navIcon"><FaSearch/></span>    
                                <span className = "span_navText">Search</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink   to="yourlibrary" 
                                    className={({isActive}) => isActive ? "MA_navLink MA_navLinkActive" : "MA_navLink"}>
                                <span className = "span_navIcon"><BiLibrary/></span>    
                                <span className = "span_navText">Your Library</span>
                            </NavLink>
                        </li>
                        <li className = "MA_navTopPlaylist_gap">

                        </li>
                        <li>
                            <button 
                                    disabled = {createPlaylistBool}
                                    onClick={e => createPlaylistHandler(e)}                             
                                    className = "PlaylistBTNB">
                                <span className = "MA_navPLusIcon"><AiOutlinePlus size={15}/></span>
                                <span className="MA_navLikeda">Create Playlist</span>
                            </button>
                        </li>
                        <li>
                            <button className = "PlaylistBTNB" onClick = {e => navigate("/app/playlist/likedsongs")}>
                                <span className = {navLikedBool ? "MA_navHeartIcon MA_navHeartIconActive" : "MA_navHeartIcon"}>
                                    <FaHeart/>
                                </span>
                                <span 
                                    to="yourlibrary"
                                    style = {{color: navLikedBool ? "#fff" : ""}} 
                                    className="MA_navLikeda">
                                        Liked Songs</span>
                            </button>
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
                            <NavLink    to="home" 
                                        className={({isActive}) => isActive ? "MA_navLink MA_navLinkActive" : "MA_navLink"}>
                                <span className = "span_navIcon"><FaHome/></span>    
                                <span className = "span_navText">Home</span>
                            </NavLink>
                        </li>
                        <li>
                            {/* <div><FaSearch/></div>
                            <Link to="search">Search</Link> */}
                            <NavLink    to="search" 
                                        className={({isActive}) => isActive ? "MA_navLink MA_navLinkActive" : "MA_navLink"}>
                                <span className = "span_navIcon"><FaSearch/></span>    
                                <span className = "span_navText">Search</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="yourlibrary" 
                                     className={({isActive}) => isActive ? "MA_navLink MA_navLinkActive" : "MA_navLink"}>
                                <span className = "span_navIcon"><BiLibrary/></span>    
                                <span className = "span_navText">Your Library</span>
                            </NavLink>
                        </li>
                        <li className = "MA_navTopPlaylist_gap">

                        </li>
                        <li>
                            <button
                                disabled = {createPlaylistBool}
                                onClick={e => createPlaylistHandler(e)} 
                                className = "PlaylistBTNB">
                                <span className = "MA_navPLusIcon"><AiOutlinePlus size={15}/></span>
                                <span className="MA_navLikeda">Create Playlist</span>
                            </button>
                        </li>
                        <li>
                            <button className = "PlaylistBTNB" onClick = {e => navigate("/app/playlist/likedsongs")}>
                                <span className = {navLikedBool ? "MA_navHeartIcon MA_navHeartIconActive" : "MA_navHeartIcon"}>
                                    <FaHeart/>
                                </span>
                                <span 
                                    to="yourlibrary"
                                    style = {{color: navLikedBool ? "#fff" : ""}} 
                                    className="MA_navLikeda">
                                        Liked Songs</span>
                            </button>
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
                    setNavOpen,
                    user,
                    home,
                    search,
                    playlists,
                    likedSongs,
                    musicPlayer,
                    notification,
                    dispatch
                    }}> 

                {/* OUTLET */}
                <div className = "MA_outletContainer">
                        <Outlet/>
                </div>


                {/* FOOTER-- MUSIC PLAYER */}
                <MusicPlayer token = {token}/>
                </AppContext.Provider>  

                {/*NOTIFICATION*/}  
                {notification && notification.length > 0 
                    && <Notification
                        notification = {notification}
                        dispatch = {dispatch}
                    />
                }
        </div>
    )
}

function Notification({notification, dispatch}){

    useEffect(() => {

    }, [])
    return (
        <ul className = "MA_notificationUL">
            {notification.map(item => {

                return <NotificationList 
                            key = {item.id}
                            id = {item.id}
                            message =  {item.message}
                            notification = {notification}
                            dispatch = {dispatch}
                            
                        />
            })}
        </ul>
    )
}

function NotificationList({id, message, notification,dispatch}){
    const [appear, setAppear] = useState(null)
    const [disappear, setDisappear] =useState(null)
    useEffect(() => {
        setAppear(true);
        
        setTimeout(() => {
            setAppear(false)
            setDisappear(true)
            // removing the list after display
            setTimeout(() => {
                const __filteredNotification = notification.filter(itemObj => itemObj.id !== id);
                dispatch({type: "SET_NOTIFICATION", payload: __filteredNotification})
            }, 500)
        }, 1200)
    }, [])
    return (
        <li>
            <p
                className = {
                    !disappear && appear ? "notificationAppear": 
                    disappear ? "notificationDissapear":
                    ""
                }
            >{message}</p>
        </li>
    )
}

export {
    spotifyApi
}