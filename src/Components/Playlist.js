import React, {
    useState, 
    useContext,
    useEffect} from "react";

import {useParams} from "react-router-dom"; 

/* Importing usePlaylistFindMore Hook */
import {usePlaylistFindMore} from "../hooks"
import { spotifyApi } from "../helper";
import { 
    PlaylistSearch, 
    PlaylistSongsList } from "../subComponents/subPlaylist";

import {FaPlay, 
    FaPause, 
    FaMusic} from "react-icons/fa";

import {BsMusicNoteBeamed} from "react-icons/bs"


// scss style
import "../styles/Playlist.scss"
import { AppContext } from "../context";
const initialSearchValue = {
    searchText: " "
}
export default function Playlist(){
    // getting playlists data ---> ALL Playlists IMP Data
    const {playlists} = useContext(AppContext);
    const {playlistID} = useParams();
    
    // PlaylistGenralData
    const [playListData,setPlayListData] = useState(null);
    const [albums, setAlbums] = useState(null);
    // for request
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
    /* USEFFECT --> PLAYLIST */
    useEffect(() => {

        /* PUBLIC PLAYLIST */
        /* FILTERING PLAYLIST DATA FROM PLAYLISTID */
        if(playlists.length > 0){
            const playlistGeneralData = playlists.filter((item, index) => item.id.toString() === playlistID.toString());
            // saving as an object
            setPlayListData(...playlistGeneralData)
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

                    const _albumsIDs = _albums.reduce((accumulater, currentItem) => {
                        return [...accumulater, currentItem.uri]
                    }, []) 
                    /* Making req for the liked ones */
                   setAlbums(_albums)
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

    }, [playlists, playlistID])

    
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
                setAlbums(albumsFiltered);
            }
        })
    }


    

    /* -->  TODO --> /* NOTE Replace with loading and loading CSS */
    if(!playListData) return
    return(
        <div className = "PL_mainContainer">

            {/* TOp DESCRIPTION */}
            <div className="PL_topMainContainer">
                {/* playlist Image */}
                <div className = "PL_topImageContainer">

                    {playListData.images.length > 0 ? 
                        <img src ={playListData.images[0].url} alt="Playlist_cover"/>:
                        <div>
                            <BsMusicNoteBeamed/>
                        </div>
                
                    }
                </div>

                {/* Playlist description */}
                <div className="PL_descriptionContainer">
                    <p className="PL_desTitle">title</p>
                    <h2 className="PL_desPlaylistName">{playListData.name}</h2>
                    <p className="PL_desProfileName">{playListData.owner.display_name}</p>
                    <p className="PL_desSongNo">{playListData.tracks.total} Songs</p>
                    <p className="PL_desSongsLength">3 min 22 sec</p>
                </div>
            </div>

             {/* Main PLayButton */}
             <div className="PL_mainPlayButtonCont">
                    <button 
                        className="PL_mainPlayButton"  

                    >
                        <FaPlay/>
                    </button>
            </div>


            <div className = "PL_playlistsDIV">


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
                                        /* methods */
                                        removeTrackFromPlaylistHandler = {removeTrackFromPlaylistHandler}
                                    />
                                    </ul>)
                    })
                }
                    
                {/* search option */}
                <PlaylistSearch
                    /* css */
                    searchFix = {searchFix}
                    /* values */
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
        </div>
    )
} 