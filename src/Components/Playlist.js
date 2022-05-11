import React, {
    useState, 
    useContext,
    useEffect} from "react";

import {useParams, useNavigate} from "react-router-dom"; 

/* Importing usePlaylistFindMore Hook */
import {usePlaylistFindMore} from "../hooks"
import { spotifyApi, milliSecondToTime } from "../helper";
import { 
    PlaylistSearch, 
    PlaylistSongsList,
    PlayBtnDropdown,
    EditPlaylist
} from "../subComponents/subPlaylist";

import {FaPlay,
    FaEllipsisH, 
    FaHeart,
    FaPause, 
    FaMusic} from "react-icons/fa";

import {BsMusicNoteBeamed, BsMusicNote} from "react-icons/bs"
import {BiTime} from "react-icons/bi"


// scss style
import "../styles/Playlist.scss"
import { AppContext } from "../context";
const initialSearchValue = {
    searchText: " "
}
export default function Playlist(){
    // getting playlists data ---> ALL Playlists IMP Data
    const {
        user,
        likedSongs,
        playlists,
        dispatch} = useContext(AppContext);
    const {playlistID} = useParams();
    // ExternalPlaylist 
    const [likedSongsBool, setLikedSongsBool] = useState(null);   
    const [external, setExternal] = useState(null); 
    const [PlaybtnDropBool, setPlaybtnDropBool] = useState(null)
    // PlaylistGenralData
    const [playListData,setPlayListData] = useState(null);
    const [likedSongsData, setLikedSongsData] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [playlistLink, setPlaylistLink] = useState(null)
    const [totalLength, setTotalLength] = useState(0);
    // for request
    const navigate = useNavigate()
    const [playListloading, setPlayListLoading ] = useState(true);

    /* SEARCH SECTION */
    const {
        loading, 
        searchInput,
        errors,
        searchTracks, 
        onFindMoreFormChangeHandler
    } = usePlaylistFindMore(initialSearchValue);
    const [findMore, setFindMore] = useState(false);
    const [searchFix, setSearchFix] = useState(false);
    const [editPlaylistBool, setEditPlaylistBool] = useState(null)
    /* USEFFECT --> PLAYLIST */
    useEffect(() => {
        /* iF no playlistID */

        // --checking for likedsongs
        if(playlistID === "likedsongs" && user && likedSongs){
            const _likedsongsTitleData = {
                title: "Liked Songs",
                imageArray: user.images, // --array--uri
                display_name: user.display_name,
                totalSongs: likedSongs.total
            }

            /* getting only Track */
            // const _tracksArray = likedSongs.items.reduce((accumulator, item) => {
            //     return [...accumulator, item.track]
            // }, [])

            const totTrackLength_ms = likedSongs.items.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.duration_ms
            },0)

            //setting values
            setPlayListData(_likedsongsTitleData)
            setTotalLength(totTrackLength_ms)
            //---default values--->
            setExternal(null);
            setLikedSongsBool(true)
            setAlbums(likedSongs.items)
            return 
        }

        //--check for external second
        if(playlistID.split(":").length > 2){
            const externalParam = playlistID.split(":"); //array

            /* COMMON_VARIABLES */

            /* FOR Type_Playlist */
            if(externalParam[1] ==="playlist"){
                // getting playlist
                spotifyApi.getPlaylist(externalParam[2])
                /* General DATA */
                .then(playlistOverallData => {
                    const _playListData = {
                        name: playlistOverallData.name,
                        owner:playlistOverallData.owner,
                        images: playlistOverallData.images,
                        id: playlistOverallData.id
                    }
                    setPlayListData(_playListData);
                    setLikedSongsBool(null);
                    setExternal(true);
                    setPlaylistLink(playlistOverallData.external_urls.spotify)
                    return playlistOverallData.id;
                })
                 /* tracks */
                .then(playlistID => {
                    spotifyApi.getPlaylistTracks(playlistID)
                    .then(trackList => {
                        const _tracks= trackList.items.reduce((accumulator, currentItem) => {
                            return [...accumulator,currentItem.track]
                        }, []);
                        const _onlyTracks = _tracks.reduce((accumulater, item) => {
                            if(item.track){
                               return [...accumulater, item]
                            }

                            return accumulater
                            //return accumulater
                        }, [])
                        const totTrackLength_ms = _onlyTracks.reduce((accumulator, currentItem) => {
                            return accumulator + currentItem.duration_ms
                        },0)

                        // setting _albums and totalLength
                        setAlbums(_onlyTracks)
                        setTotalLength(totTrackLength_ms)
                    })
                })
            }

            /* SKIPPED PART */
            if(externalParam[1] === "album"){
                spotifyApi.getAlbum(externalParam[2])
                /* General DATA */
                .then(_album => {
                    const _playListData = {
                        name: _album.name,
                        owner: {
                            display_name: _album.owner ? _album.owner: "Spotify"
                        },
                        images: [_album.images[0]],
                        id: _album.id
                    }
                    /* NOTE */
                    /* SKIPPED PART */
                    spotifyApi.getAlbumTracks(_album.id)
                    .then((trackList => {
                        console.log("albumtracks", trackList)
                        const _tracks= trackList.items.reduce((accumulator, currentItem) => {
                            if(currentItem.type ==="track"){
                                accumulator = [...accumulator, currentItem]
                            }
                            return accumulator
                        }, []);
                        const _onlyTracks = _tracks.reduce((accumulater, item) => {
                            if(item.type ==="track"){
                               return [...accumulater, item]
                            }

                            return accumulater
                            //return accumulater
                        }, [])
                        const totTrackLength_ms = _onlyTracks.reduce((accumulator, currentItem) => {
                            return accumulator + currentItem.duration_ms
                        },0)

                        console.log("tracks",_onlyTracks)
                        console.log("onlyTracks", _onlyTracks)
                        // setting _albums and totalLength
                        console.log("playlistData",_playListData)
                        setPlayListData(_playListData)
                        setExternal(true)
                        setAlbums(_onlyTracks)
                        setTotalLength(totTrackLength_ms)
                    }))
                   
                })
            }

            return

        }

        /* PUBLIC PLAYLIST */
        /* FILTERING PLAYLIST DATA FROM PLAYLISTID */
        if(playlists.length > 0){
            const playlistGeneralData = playlists.filter((item, index) => item.id.toString() === playlistID.toString());
            if(!playlistGeneralData){
                // error page
            }


            // saving as an object
            setExternal(false)
            setExternal(null);
            setLikedSongsBool(null)
            setPlayListData(...playlistGeneralData)
            setPlaylistLink(playlistGeneralData[0].external_urls.spotify)
        }

        // getting albums from ID;
        if(playlistID){
            spotifyApi.getPlaylistTracks(playlistID)
            .then(data => {
                //setAlbums(data.items)
                
                /* Triimming the data.items --> trackOnly */
                if( data && data.items){

                    const _albums = data.items.reduce((accumulator, currentItem) => {
                        return [...accumulator,currentItem.track]
                    }, [])


                    const _onlyTracks = _albums.reduce((accumulater, item) => {
                        if(item.track){
                           return [...accumulater, item]
                        }

                        return accumulater
                        //return accumulater
                    }, [])
                    // const _albumsIDs = _albums.reduce((accumulater, currentItem) => {
                    //     return [...accumulater, currentItem.uri]
                    // }, []) 
                    /* Making req for the liked ones */
                    /* Getting the total Length of all tracks */
                    const totTrackLength_ms = _onlyTracks.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.duration_ms
                    },0)
                    setTotalLength(totTrackLength_ms)
                    setAlbums(_onlyTracks)
                }
                // if no albums then setting FINDMORE TO TRUE
                if(data.items.length === 0){
                    setFindMore(true)
                }else {
                    setFindMore(false)
                }
                
                // setting fix for search section
                if(data.items.length > 0){
                    setSearchFix(true)
                }

                // clearing everything for the new platlist

            })
        }
    }, [playlists,user,playlistID, likedSongs])

    
    /* ADD Tracks to PlayLIST */
    function addTrackToPlaylistHandler(trackUriID){
        
        // checking if the track already exists in the playlist
        if(albums){
            const trackExists = albums.filter((album) => album.uri === trackUriID)
            if(trackExists.length > 0){
                return null
            }
        }
      

        spotifyApi.addTracksToPlaylist(playlistID,[trackUriID])
        .then(data => {

            // success
            if(data && data.snapshot_id){
                const newTrack = searchTracks.filter(track => track.uri === trackUriID)
                const newAddedTrack = [...albums, ...newTrack]
                setTotalLength(totalLength + newTrack[0].duration_ms)
                setAlbums(newAddedTrack);
            }
        })
    }

    /* ADD Tracks to PlayLIST */
    function removeTrackFromPlaylistHandler(trackUriID){
        // removing 
        spotifyApi.removeTracksFromPlaylist(playlistID,[trackUriID])
        .then(data => {
            // success
            if(data && data.snapshot_id){
                const albumsFiltered = albums.filter(track => track.uri !== trackUriID)
                const timeToreduce = albums.filter(track => track.uri === trackUriID)[0].duration_ms
                setTotalLength(totalLength - timeToreduce)
                setAlbums(albumsFiltered);
            }
        })
    }

    /* SETTING MUSIC PLAYER */
    function musicDispatchHandler(trackUri,setPlay){
        const uriArray = albums.reduce((accum, currentItem) => {
            return [...accum, currentItem.uri]
        }, [])
        const trackDetails = albums.reduce((accum, currentItem) => {
            return [...accum,
                    {
                        name: currentItem.name,
                        artists: currentItem.artists,
                        image: currentItem.album.images[0].url,
                        uri: currentItem.uri
                    }]
        }, [])
        const trackPosition = uriArray.indexOf(trackUri);
        /* contextURI playlistURI or albumURI */
        const musicData = {
            playlistID: playlistID,
            conntext_uri : playListData.uri,
            trackDetails: trackDetails,
            uris: uriArray,
            currentTrackUri: trackUri,
            currentPosition: trackPosition,
            setPlay: setPlay,
            playlistChanged: false,

        }
        dispatch({type: "SET_MUSICPLAYER", payload: musicData})
    }

    function removeLikedSongsHandler(id){
        const _newItems = likedSongs.items.filter(item => item.id.toString() !== id.toString()) 
        const likedCount = likedSongs.total - 1
        const _newLikedSongs = {
            items: _newItems,
            total: likedCount
        }
        dispatch({type: "SET_SAVEDTRACKS", payload: _newLikedSongs})
    }

    
    function addLikedSongsHandler(id){
        const _itemsCopy = [...likedSongs.items] 
        const _item = albums.filter(item => item.id.toString() === id.toString())[0]
        const _newItems = [..._itemsCopy,_item]
        const likedCount = likedSongs.total + 1
        const _newLikedSongs = {
            items: _newItems,
            total: likedCount
        }
        dispatch({type: "SET_SAVEDTRACKS", payload: _newLikedSongs})
    }

    function deletePlaylistHandler(){
       const _filteredPlaylist = playlists.filter(playlist => playlist.id.toString() !== playlistID)
       dispatch({type: "SET_PLAYLIST", payload: _filteredPlaylist})
       navigate("/app/yourlibrary")
    }

    function playlistNameChangeHandler(nameValue){
       const newArray = playlists.map(playlist => {
           if(playlist.id === playlistID){
                return {...playlist, name: nameValue}
           }
           return playlist
       })
       // setting new playlists
       dispatch({type: "SET_PLAYLIST", payload: newArray})
    }
    
    /* -->  TODO --> /* NOTE Replace with loading and loading CSS */
    if(!playListData || !albums) return
    console.log("playlistData", playListData)
    console.log("playlists", playlists)
    return(
        <div className = "PL_mainContainer">

            {/* TOp DESCRIPTION */}
            <div 
                className="PL_topMainContainer"
                style = {{
                    background: likedSongsBool ? "linear-gradient(to bottom right, #513A9F, #2B1F54)" 
                                :null
                }}
                
                >
                {/* playlist Image */}
                <div className = "PL_topImageContainer">

                    {!likedSongsBool && playListData.images.length > 0 ? 
                        <img src ={playListData.images[0].url} alt="Playlist_cover"/>:
                        !likedSongsBool ?
                        <div>
                            <BsMusicNoteBeamed/>
                        </div>
                        : null
                    }

                    {/* Replace with heartIcon */}
                    {likedSongsBool ? 
                        <div style = {
                            {background: "linear-gradient(to bottom right, #4218B7, #7B8F88)"}
                        }>
                            <FaHeart style = {{color: "#fff", fill: "#fff"}} size = {80}/>
                        </div>: null
                    }
                </div>



                {/* Playlist description */}
                {!likedSongsBool &&
                    <div className="PL_descriptionContainer">
                        <p className="PL_desTitle">PLAYLIST</p>
                        <h2 className="PL_desPlaylistName">{playListData.name}</h2>
                        <p className="PL_desProfileName">{playListData.owner.display_name}</p>
                        <p className="PL_desSongNo">{ 
                            albums &&
                            albums.length === 1 ? "1 Song"  
                            :albums.length > 1 ? `${albums.length} Songs`
                            : albums === null ? "0 Songs"
                            : "0 Songs"
                            
                        } </p>
                        <p className="PL_desSongsLength">
                            {milliSecondToTime(totalLength, true)}
                        </p>
                    </div>
                }



                {likedSongsBool &&

                    <div className="PL_descriptionContainer">
                        <p className="PL_desTitle">playlist</p>
                        <h2 className="PL_desPlaylistName">Liked Songs</h2>
                        <p className="PL_desProfileName">{playListData.display_name}</p>
                        <p className="PL_desSongNo">{ 
                           playListData && playListData.totalSongs.length === 1 ? "1 liked song"  
                           :playListData.totalSongs.length > 1 ? `${playListData.totalSongs.length} liked Songs`
                           : playListData.totalSongs === null ? "0 liked songs"
                           : "0 liked songs"
                            
                        } </p>
                        <p className="PL_desSongsLength">
                            {milliSecondToTime(totalLength, true)}
                        </p>
                    </div>

                }
            </div>

             {/* Main PLayButton */}
            <div className="PL_mainPlayButtonCont"
                 style = {
                            {border: 
                                likedSongsBool && albums.length ===0 ? "none":
                                albums && albums.length > 0 ? "none" : null,
                             background: likedSongsBool ? "linear-gradient(to bottom, #21183F, #15131A)" : null
                            }
                        } 
             >

                 {/* showing if tracks exists */}
                 {albums && albums.length > 0 && 
                          <button 
                            disabled = {(albums && albums.length > 0) ? false : true}
                            className="PL_mainPlayButton" 
                            onClick={(e) => {musicDispatchHandler(albums[0].uri,"play")}}>
                            <FaPlay/>
                        </button>
                 
                 }  

                 {!likedSongsBool &&
                    <div className = "PL_PlayULCFIX">
                    <button 
                        onClick = {e => {
                            setPlaybtnDropBool(true)
                        }}                    
                        className = "PL_playBtnEllipsis">
                        <div></div>
                        <div></div>
                        <div></div>                
                    </button>

                    {PlaybtnDropBool ?  
                        <PlayBtnDropdown
                            setPlaybtnDropBool = {setPlaybtnDropBool}
                            external = {external}
                            setEditPlaylistBool = {setEditPlaylistBool}
                            playlistLink = {playlistLink}
                            deletePlaylistHandler = {deletePlaylistHandler}
                            
                        />
                        : null
                    
                    }     
              </div>
                 
                 
                 }
            </div>

            { likedSongsBool && albums && albums.length === 0 &&

                <div className = "PL_LikedboolNone">
                    <ul className = "PL_LikedboolUL">
                        <li className = "PL_LikedboolUL_l1">
                            <BsMusicNote/>
                        </li>
                        <li>
                            <h2>Songs you like will appear here</h2>
                        </li>
                        <li>
                            <p>Save songs by tapping the heart icon</p>
                        </li>
                        <li>
                            <button onClick={ e => {
                                navigate("/app/yourlibrary")
                            }}>
                                Find songs
                            </button>
                        </li>
                    </ul>
                </div>
            }

            <div className = "PL_playlistsDIV">
                {/* List Heading */}
                {albums && albums.length> 0 && 
                    <ul className="PL_playListsULROWHeading">
                        <li className = "PL_HL1">#</li>
                        <li className = "PL_HL2">Title</li>
                        <li className = "PL_HL3">Albums</li>
                        <li className = "PL_HL4"></li>
                        <li className = "PL_HL5"></li>
                        <li className = "PL_HL6">  
                            <BiTime size={20}/>
                        </li>
                        <li className = "PL_HL7"></li>
                    </ul>
                } 
                {/* list of albums */}
                {/* For Each ALBUM  PL_playListsULROW*/}
                {albums && albums.length> 0 &&
                    albums.map((album, index) => {

                       return ( <ul 
                                    className= "PL_playListsULROW"
                                    key = {index}
                                    >
                                    {/* LIST__ROW */}
                                    {/* PASSING __TRACK OBJECT --> ACTUAL */}
                                    <PlaylistSongsList
                                        key = {`${index} + ${index}`}
                                        track = {album}
                                        searchSectionBool = {false}
                                        index = {index}
                                        external = {external}
                                        likedSongsBool = {likedSongsBool}
                                        /* methods */
                                        removeTrackFromPlaylistHandler = {removeTrackFromPlaylistHandler}
                                        removeLikedSongsHandler = {removeLikedSongsHandler}
                                        addLikedSongsHandler = {addLikedSongsHandler}
                                        musicDispatchHandler = {musicDispatchHandler}
                                    />
                                    </ul>)
                    })
                }
                    
                {/* search option */}
                <PlaylistSearch
                    /* css */
                    searchFix = {searchFix}
                    /* values */
                    external = {external}
                    likedSongsBool = {likedSongsBool}
                    playlistID = {playlistID}
                    findMore = {findMore}  /* Boolean */
                    setFindMore = {setFindMore} /* Boolean */
                    onFindMoreFormChangeHandler = {onFindMoreFormChangeHandler}
                />

                {/* SEARCH RESULT */}
                {/* Findmore, searchTracks Length */}
                {   findMore && 
                    searchTracks && searchTracks.length > 0 &&
                    //COPY OF ALBUM PLAYLIST --> BUT FOR TRACKS ONLY *
                    searchTracks.map((track, index) => {
                        return ( <ul 
                            className= "PL_playListsULROW"
                            key = {index}
                            >
                            {/* LIST__ROW */}
                            {/* PASSING __TRACK OBJECT --> ACTUAL */}
                            <PlaylistSongsList
                                key = {`${index} + ${index}`}
                                track = {track}
                                searchSectionBool = {true}
                                /* Methods--Addplaylist*/
                                addTrackToPlaylistHandler = {addTrackToPlaylistHandler}
                            />
                            </ul>)                       
                    })
                }

            </div>

        {editPlaylistBool &&
            <EditPlaylist 
                setEditPlaylistBool = {setEditPlaylistBool}
                playlistName = {playListData.name}
                playlistID = {playListData.id}
                playlistNameChangeHandler = {playlistNameChangeHandler}
            />
        }
        </div>
    )
} 