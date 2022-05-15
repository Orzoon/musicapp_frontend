import React,{useEffect, useState, useRef, useContext} from "react";
import { useParams } from "react-router-dom";
import {milliSecondToTime} from "../helper";
import { spotifyApi } from "../helper";
import { AppContext } from "../context";
// icons
import {
    MdSearch, 
    MdMusicNote,
    MdClose} from "react-icons/md";
import {
    FaHeart,
    FaEllipsisV,
    FaEllipsisH,
    FaPlay} from "react-icons/fa"

/******PLAYLIST_SEARCH*******/
export function PlaylistSearch({
    external,
    likedSongsBool,
    searchTracksLength,
    searchFix,
    findMore,
    setFindMore,
    onFindMoreFormChangeHandler
}){
    const {playlistID} = useParams();
    const [inputValue, setInputValue] = useState(" ")
    const _findMore = (
        <>
            <button 
                className= "PL_playlistFindMoreBtn"
                onClick={() => {
                  if(!findMore){
                      setFindMore(true)
                  }
                }}
            >FIND MORE</button>      
        </>
    )
    useEffect(() => {
        onFindMoreFormChangeHandler(inputValue)
    }, [inputValue])

    useEffect(() => {
        setInputValue(" ")
    }, [playlistID])

    const _PlaylistSearch =(
        <>
            <p>Lets find something for your playlist</p>
            <button 
                className="PL_playlistSearchCloseBtn"
                onClick={(e) => {
                    setInputValue("");
                    setFindMore(false);
                }}
                >
                <MdClose fontSize={32}/>
            </button>
            <form className="PL_playlistSearchForm">
                <ul className = "PL_playlistSFUL">
                    <li><MdSearch fontSize={24}/></li>
                    <li>
                        <input 
                            name = "searchText"
                            placeholder="Search for tracks"
                            value = {inputValue}  
                            onChange = {(e) => setInputValue(e.target.value)}
                        />
                    </li>
                    <li>
                      <button 
                        className = "PL_playlistSearchFormClearBtn"
                        onClick={(e) => {
                            e.preventDefault();
                            setInputValue("")
                        }}
                        >
                        <MdClose fontSize={24}/>
                      </button>
                    </li>
                </ul>
            </form>
        </>
    ) 

    if(external || likedSongsBool) return null
    return(
        <div 
            className = {((findMore && searchFix)) ? 
            "PL_playlistSearch PL_playlistSearchFIX" 
            : "PL_playlistSearch"}>
            {/* SEARCH FROM OR FIND MORE BTN */}
            {!findMore && _findMore}
            {/* SEARCH TITLE */}
            {findMore && _PlaylistSearch}
            
            {findMore && inputValue.length > 1 && searchTracksLength === 0 &&
                <div className = "PL_NoSearchResult">
                    <h2>No Results found</h2>
                    <p>Please make sure your words are spelled correctly or use less or different keywords.</p>
                </div>            
            }
        </div>
    )
}



/******PLAYLIST_SONGSList*******/
export function PlaylistSongsList(props){
    const {
        external,
        track, 
        searchSectionBool,
        addTrackToPlaylistHandler,
        currentPlayingURIID,
        clickActiveListID,
        index,
        removeTrackFromPlaylistHandler,
        removeLikedSongsHandler,
        addLikedSongsHandler,
        musicDispatchHandler,
        setClickActiveListID,
        likedSongs,
        likedSongsBool,
        playlistID
    } = props;
    const [dropDownBool, setDropDownBool] = useState(false);
    const [liked, setLiked] = useState(false);
    const {
        id,
        name,
        album,
        artists: artistsArray,
        duration_ms,
        type,
    } = track;
    const time = milliSecondToTime(duration_ms); 

    /* color Change  */
    const listRef = useRef(id)
    /* Checking for the liked song */
    useEffect(() => {
        
        // // checked against liked songs
        // if(!likedSongsBool){
        //     spotifyApi.containsMySavedTracks([track.id])
        //     .then(liked => {
        //         setLiked(liked[0])
        //     })
        //     .catch(error => {
        //         setLiked(false)
        //     })
        // }else if(likedSongsBool){
        //     setLiked(true)
        // }
        // else {
        //     setLiked(false)
        // }
        if(!likedSongsBool && !searchSectionBool){
            const _itemsIdArray = likedSongs.itemsIdArray;
            const _includes = _itemsIdArray.includes(id)
            if(_includes){
                setLiked(true)
            }else{
                setLiked(false)
            }
        }
        if(likedSongsBool){
            setLiked(true)
        }
    })

    function saveRemoveSongsHandler(id, action){
        if(track.type !=="track") return null
        if(action ==="SAVE"){
           spotifyApi.addToMySavedTracks([id])
           .then(response => { 
                setLiked(true)
                addLikedSongsHandler(id)
           })
           .catch(error => {
               return null;
           })
        }

        if(action ==="REMOVE"){
            spotifyApi.removeFromMySavedTracks([id])
            .then(response => {
                        setLiked(false)
                        removeLikedSongsHandler(id)
                    // if(likedSongsBool){
                    //     removeLikedSongsHandler(id)
                    // }
            })
            .catch(error => {
                console.log("something went wrong")
                return null
            })
        }
    }

    
    if(!track){
        return null
    }
    return(
        <li 
            ref = {listRef}
            className = "PL_playListLROW" 
            style = {{
                background: clickActiveListID && clickActiveListID === id ? "#5A5A5A" : "" 
            }}
            onClick = {e => {setClickActiveListID(id)}}
            >
            {/*COLUMN UL**/}
            <ul className="PL_playListULColumn">
                {/* Hiding number list in smaller devices */} 
                {/* Number */}
                <li className = "PL_ULC_1">1</li>
                {/* PlayBTN */}
                <li className = "PL_ULC_2">
                    
                    {currentPlayingURIID && currentPlayingURIID === track.uri ? 
                        <button
                            className="PL_ULC_7PlayBtnPlay"
                            disabled = {true}
                            >   
                            <span className = "playContainer"> 
                                <span className = "play1Anim"></span>
                                <span className = "play2Anim"></span>
                                <span className = "play3Anim"></span>
                                <span className = "play4Anim"></span>
                            </span>
                        </button> :
                        <button 
                            className="PL_ULC_7PlayBtn"
                            onClick={(e) => {
                                /* iimage name and artists later on */
                                    musicDispatchHandler(track.uri,"play")                         
                                }}>
                            <FaPlay/>
                         </button>              
                    }
                </li>
                {/*Music NOTE ICON OR PODCAST ICON */}
                <li className = "PL_ULC_3">
                    {/*Music NOTE ICON OR PODCAST ICON */}
                    <MdMusicNote/>
                </li>

                {/* Image */}
                <li className = "PL_ULC_4">
                    <img src={album && album.images[0].url} alt = "#"/>
                </li>
                {/* Song Name */}
                <li className = "PL_ULC_5">
                    {/* changing Name color ----> onPlayerState */}
                    <h3
                        style = {{color: currentPlayingURIID === track.uri ? "#1ed760" :"#fff"}}
                        >{name}</h3>
                    {/* fix with ul */}
                    <div>
                        {/* ALBUM ARTISTS LOOP */}
                        {/* REPLACING WITH LINK LATER ON */}
                        {album.artists.map((artist, index) => {
                        
                                if(index > 0){
                                    return (
                                        <a 
                                            key = {artist.id}
                                            href = {artist.href}
                                            style = {{
                                                color: clickActiveListID === id ? "#fff" : " "
                                            }}
                                            onClick = {e => e.preventDefault()}
                                        >
                                            {","}{" "}<span>{artist.name}</span>
                                        </a>
                                    ) 
                                }
                                return (
                                    <a 
                                    style = {{
                                        color: clickActiveListID && clickActiveListID === id ? "#fff" : " "
                                    }}
                                    key = {artist.id}
                                    href = {artist.href}
                                    onClick = {e => e.preventDefault()}
                                    >
                                     <span>{artist.name}</span>
                                    </a>
                                )
                        })}
                    </div>
                </li>

                {/* ALBUM OR PODCAST */}
                <li className = "PL_ULC_6">
                    <h3
                        style = {{
                        color: clickActiveListID && clickActiveListID === id ? "#fff" : " "
                    }}                                     
                    >
                        {album.name}
                    </h3>
                </li>
                {/* NOTE -- NO RELEASE DATE -- */}
                
                {/* SEARCH SECTION 7-8-9 */}
                {!searchSectionBool ? 
                 <>

            
                        {/* Like */}
                        <li className = "PL_ULC_7">
                            <button 
                                className="PL_ULC_7LikeBtn"
                                onClick={(e) => {
                                    if(liked){
                                        return saveRemoveSongsHandler(track.id, "REMOVE")
                                    }
                                    return saveRemoveSongsHandler(track.id, "SAVE")
                                }}
                                >
                                <FaHeart fill={liked ? "#1ed760" : "#A2A2A2" }/>
                            </button>
                        </li>  

                        {/* Like --- END*/}
                        {/* length */} 
                        <li className = "PL_ULC_8">
                        {time.join(":")}   
                        </li> 

                        {/* Option Button */} 
                        <li 
                            className = "PL_ULC_9">
                                <button 
                                    className="PL_ULC_7OptionBtn"
                                    onClick={(e) => {
                                        setDropDownBool(true)
                                    }}
                                    >
                                    <FaEllipsisV/>
                                </button>

                                <button 
                                    className="PL_ULC_7OptionBtn2"
                                    onClick={(e) => {
                                        setDropDownBool(true)
                                    }}
                                    >
                                    <FaEllipsisH/>
                                </button>
                            {/* Drop Down */}

                            {dropDownBool && 
                            <ListDropdown 
                                external = {external}
                                id = {id}
                                dropDownBool = {dropDownBool}
                                setDropDownBool = {setDropDownBool}
                                likedSongsBool = {likedSongsBool}
                                liked = {liked}
                                external_urls = {track.external_urls || " "}
                                /* Methods */
                                saveRemoveSongsHandler = {saveRemoveSongsHandler}
                                removeTrackFromPlaylistHandler = {removeTrackFromPlaylistHandler}
                                removeLikedSongsHandler = {removeLikedSongsHandler}
                                trackUri = {track.uri}
                                trackType = {track.type}
                                />}
                        </li>      
                 </>:
                 <li className="PL_ULC_10">
                     <button
                        className = "PL_ULC_10_AddToPlaylistBtn"
                        onClick={(e) => {addTrackToPlaylistHandler(track.uri)}}
                     >
                         Add
                     </button>
                 </li>
                }     
            </ul>
        </li>
    )

}


/*****LISTDROPDOWN*** */
function ListDropdown(props){
    const {
        notification,
        dispatch
    }= useContext(AppContext)
    const {
        external,
        id, 
        dropDownBool,
        setDropDownBool,
        likedSongsBool,
        fixDropDownMethod,
        trackUri,
        trackType,
        liked,
        external_urls,
        removeTrackFromPlaylistHandler,
        removeLikedSongsHandler,
        saveRemoveSongsHandler
        } = props;
    const ListDropdownRef = useRef(null)


    function outsideClickListDropDownHandler(e){
        if(ListDropdownRef && !ListDropdownRef.current.contains(e.target)){
            setTimeout(() => {
                setDropDownBool(false)
            },12)
           
        }
    }
    useEffect(() => {
        window.addEventListener("click", outsideClickListDropDownHandler, true)

        return (() => {
            window.removeEventListener("click", outsideClickListDropDownHandler, true)
        })
    },[])
    return(
    <ul 
        className = "PL_ULC_9UL"
        ref = {ListDropdownRef}
        >
        
        {external || likedSongsBool? 
            null: 
            <li>
                <button
                    onClick={(e) => {
                        removeTrackFromPlaylistHandler(trackUri)
                        setDropDownBool(false)
                    }}
                >Remove From this playlist</button>
            </li>}
        <li>
            {liked ? 
                <button
                    onClick={(e) => {
                        saveRemoveSongsHandler(id, "REMOVE")
                        setDropDownBool(false)
                    }}
                >Remove from to your liked songs</button>
                :<button
                onClick={(e) => {
                    saveRemoveSongsHandler(id, "SAVE")
                    setDropDownBool(false)
                }}
                >Save to your liked songs</button>
            }
        </li>
        <li className = "PL_ULC_9UL_CopyLink">
            <button
                onClick={(e) => {
                    const link = external_urls.spotify;
                    if(navigator.clipboard){
                        navigator.clipboard.writeText(link)
                        .then((text) => {
                          //setting  the notification later on
                          // closing the menu
                          setDropDownBool(false)

                            // notification
                            const __setNotification = [...notification, {
                                id: id+Math.random()+"copied",
                                message: "Link copied"
                            }]
                            dispatch({type: "SET_NOTIFICATION", payload:__setNotification })})
                        .catch(error=> {
                            // failed
                            return null
                        })
                    }
                }}
            >Share > Copy {trackType} link</button>
        </li>
    </ul>
    )
}

/*****PlayBtnDropdown*** */
export function PlayBtnDropdown(props){
    const {
        notification,
        dispatch
    }= useContext(AppContext)
    const playbtnRef = useRef();
    const {
        setPlaybtnDropBool,
        setAboutRecomBool,
        external,
        setEditPlaylistBool,
        playlistLink,
        deletePlaylistHandler
        
    }= props;

    function outsideClickListPlayDropDownHandler(e){
        if(playbtnRef && !playbtnRef.current.contains(e.target)){
            setTimeout(() => {
                setPlaybtnDropBool(false)
            },12)
           
        }
    }
    useEffect(() => {
        window.addEventListener("click", outsideClickListPlayDropDownHandler, true)

        return (() => {
            window.removeEventListener("click", outsideClickListPlayDropDownHandler, true)
        })
    },[])

    return(
        <ul 
            className = "PL_PlayULC"
            ref = {playbtnRef}
            >


            {external ? 
            
            
            <li>
            <button
                    onClick={(e) => {
                    // after deleting the playlist
                        setPlaybtnDropBool(false)
                        setAboutRecomBool(true)
                        //show recommendations instead
                    }}>
                        About recommendations
                </button>
            </li>
            : 
            <>
            <li>
                <button
                    onClick={(e) => {
                        //removeTrackFromPlaylistHandler(trackUri)
                        //setDropDownBool(false)
                        //opening details
                        setPlaybtnDropBool(false)
                        setEditPlaylistBool(true)
                    }}>
                        Edit details
                </button>
            </li>

            <li>
                <button
                        onClick={(e) => {
                        // after deleting the playlist
                            //setPlaybtnDropBool(false)
                            deletePlaylistHandler()
                            //setPlaybtnDropBool(false)
                        }}>
                            Delete
                    </button>
            </li>
            </>
            
            }
            
            <li className = "PL_ULC_9UL_CopyLink">
                <button
                    onClick={(e) => {
                        //const link = external_urls.spotify;
                        if(navigator.clipboard){
                            navigator.clipboard.writeText(playlistLink)
                            .then((text) => {
                            //setting  the notification later on
                            setPlaybtnDropBool(false)
                             // notification
                             const __setNotification = [...notification, {
                                id: playlistLink+Math.random()+"copied",
                                message: "Link copied"
                            }]
                            dispatch({type: "SET_NOTIFICATION", payload:__setNotification })})
                            .catch(error=> {
                                // failed
                                return null
                            })
                        }
                    }}
                >Share > Copy playlist link</button>
            </li>

        </ul>
    )
}


/*****PlayBtnDropdown*** */
export function EditPlaylist(props){
    const {
        setEditPlaylistBool,
        playlistName,
        playlistID,
        playlistNameChangeHandler
    } = props;
    const [inputValue, setInputValue] = useState("");
    const [submitBool, setSubmitBool] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        setInputValue(playlistName)
    }, [playlistName])
    function onChangehandler(e){
        const value = e.target.value
        if(value.length > 0){
            setError(false)
        }
        setInputValue(value)
    }

    function submitHandler(){
        setSubmitBool(true)
        if(inputValue.length === 0){
            setError(true)
            setSubmitBool(false)
            return null;
        }
        // disabling the submit button
        spotifyApi.changePlaylistDetails(playlistID, {
            name: inputValue
        })
        .then(nameChanged => {
            // calling the playlist reducerChangeHandler
            playlistNameChangeHandler(inputValue)
            setEditPlaylistBool(false)
        })
        .catch(error => {
            if(error) setEditPlaylistBool(false)
        })
    }
    return (
        <div 
            className = "EditPlaylistMainContainer">
            
            <div 
            className = "formContainer">
                <h2>Edit details</h2>
                {error &&
                <p>Playlist name is required</p>
                }
                <button 
                    className = "Form_close"
                    onClick = {e => {setEditPlaylistBool(false)}}
                    >
                    <MdClose/>
                </button>
                <input 
                    value = {inputValue}
                    onChange = {(e) => onChangehandler(e)}
                    />
                <button 
                    disabled = {submitBool} 
                    onClick = {e => submitHandler()}               
                    className = "Form_save">
                    Save
                </button>
            </div>
        </div>
    )
}


/*****Anbout Playlist** */
export function AboutPlaylist(props){
    const {
        setAboutRecomBool
    } = props;
    return (
        <div 
            className = "RecommPlaylistMainContainer">
            
            <div className = "RecommContainer">
                <h2>About Recommendations</h2>
                <button 
                    className = "Form_close"
                    onClick = {e => {setAboutRecomBool(false)}}
                    >
                    <MdClose/>
                </button>

                <div className = "RecommPDIV">
                    <p>Our recommendations help you find audio you’ll enjoy, whether that’s an old favorite or a new song or show you never knew you’d be into.</p>

                    <p>Our editors around the globe have extensive knowledge about music and culture, and make sure our playlists are created with the best listener experience in mind.</p>

                    <p>Our personalized recommendations are tailored to your unique taste, taking into account a variety of factors, such as what you’re listening to and when, the listening habits of people who have similar taste in music and podcasts, and the expertise of our music and podcast specialists.</p>
                    <p> In some cases, commercial considerations may influence our recommendations, but listener satisfaction is our priority and we only ever recommend content we think you’ll want to hear. Our recommendations rely on signals from you, so keep on listening to the songs and podcasts you love!.</p>
                </div>
            </div>
        </div>
    )
}




