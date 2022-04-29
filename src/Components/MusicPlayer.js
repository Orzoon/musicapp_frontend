import React,{useState, useContext, useEffect} from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import { AppContext } from "../context";
import "../styles/musicplayer.scss";
/* Importing icons */
import {BiShuffle, 
        BiSkipNext, 
        BiSkipPrevious, 
        BiRepeat,
        BiPlay,
        BiPause
    } from "react-icons/bi";


function MPLeft({trackDetails, uriToPlay}){
    const [title, setTitle] = useState(null)
    const [imgSrc, setImgSrc] = useState(null)
    const [artistNames, setArtistsNames] = useState(null); //array
    useEffect(() => {
        if(trackDetails && uriToPlay){
            const track = trackDetails.filter(item => item.uri === uriToPlay[0]);
            const artists = track[0].artists.reduce((accum, artist) => {
                return [...accum, artist.name]
            }, [])
            console.log("track", track)
            console.log("artists", artists)
            setTitle(track[0].name)
            setImgSrc(track[0].image)
            if(artists){
                setArtistsNames(artists)
            }
            //setArtistsNames(artists)
        }
    }, [uriToPlay,trackDetails])


    if(!trackDetails || !uriToPlay) return
    //if(!title || !imgSrc || !artistNames)  return null
    return(
        <>  
            <img src = {imgSrc} alt= "#"/>
            <h2>{title}</h2>
            <div>
                <p>{artistNames &&  artistNames.join(", ")}</p>
            </div>
        
        </>
    )

}
export default function MusicPlayer(props){
    /* gets Value from Context */
    const {
        musicPlayer,
        dispatch
    } = useContext(AppContext);
    const [play, setPlay] = useState(false);

    /* songs to Play info */
    const [uriToPlay, setUriToPlay] = useState(null)// array
    const [playerState, setPlayerState] = useState(null)
    const [previousTracks, setPreviousaTracks] = useState([]);
    const [trackDetails,setTrackDetails] = useState(null)// array

    useEffect(() => {
        if(musicPlayer){
            console.log("musicPlayer", musicPlayer)
            if(musicPlayer.setPlay === "play"){

                if(musicPlayer.trackDetails){
                    setTrackDetails(musicPlayer.trackDetails)
                }
                if(play){
                    setPlay(false)
                }
                playHandler();
            }
        }
    }, [musicPlayer])
    /* METHODS */
    function playHandler(e){
        /* passing song to play */
        //--check position
        //---set uri
        /* for now just Current song URI */
        /* IF it is playing, keep Playing */
        //if(play) return null
        const urisArray = musicPlayer.uris;
        setUriToPlay([urisArray[musicPlayer.currentPosition]])
        setPlay(true)


    }

    function pauseHandler(e){
       setPlay(false)
    }

    function playNext(e){

        //--check for the playlistChange id and changeData
        /*-----------CHANGE IMPLEMENTATION LATER ---ON */
        // TODO SECTION
        /*-----------------------------*/
        /* if it hasnot been changed */
        if(musicPlayer.uris.length === 1){
            // setUriToPlay(musicPlayer.uris[0])
            // setPlay(true)
            // setting the track to play
            const payload = {
                ...musicPlayer,
                currentTrackUri: uriToPlay,  
            }
            console.log("MusicPlayerBefore", musicPlayer)
            // updating the musicplayerObject
            dispatch({type:"SET_MUSICPLAYER", payload: payload})
            console.log("after", musicPlayer)
            return 
        }

        // changing current postion, currentTrack
        let newCurrentPosition;
        if((musicPlayer.currentPosition + 1) > musicPlayer.uris.length-1){
            newCurrentPosition = 0
        }
        else {
            newCurrentPosition = musicPlayer.currentPosition + 1
        }

        // setting the track to play
        const payload = {
            ...musicPlayer,
            currentTrackUri: musicPlayer.uris[newCurrentPosition],
            currentPosition: newCurrentPosition    
        }
        console.log("MusicPlayerBefore", musicPlayer)
        // updating the musicplayerObject
        dispatch({type:"SET_MUSICPLAYER", payload: payload})
        console.log("after", musicPlayer)
        

    }

    function playPrev(e){
        setPlay(false)
        setUriToPlay(null)
        // setting player to false and changing data
        //--check for the playlistChange id and changeData
        /*-----------CHANGE IMPLEMENTATION LATER ---ON */
        // TODO SECTION
        /*-----------------------------*/
        /* if it hasnot been changed */
        if(musicPlayer.uris.length === 1){
            // setUriToPlay(musicPlayer.uris[0])
            // setPlay(true)
            const payload = {
                ...musicPlayer,
                currentTrackUri: uriToPlay,  
            }
            console.log("MusicPlayerBefore", musicPlayer)
            // updating the musicplayerObject
            dispatch({type:"SET_MUSICPLAYER", payload: payload})
            console.log("after", musicPlayer)
            return 
        }

        // changing current postion, currentTrack
        let newCurrentPosition;
        if(musicPlayer.currentPosition === 0){
            newCurrentPosition = 0
        }
        else {
            newCurrentPosition = musicPlayer.currentPosition - 1
        }

        // setting the track to play
        const payload = {
            ...musicPlayer,
            currentTrackUri: musicPlayer.uris[newCurrentPosition],
            currentPosition: newCurrentPosition    
        }
        console.log("MusicPlayerAfter", musicPlayer)
        // updating the musicplayerObject
        dispatch({type:"SET_MUSICPLAYER", payload: payload})
        console.log("after", musicPlayer)
    }
    if(!props.token) return
    if(!musicPlayer) return
    //if(MusicPlayer && Object.keys(MusicPlayer).length === 0) return

    return(
        <div className = "MP_Container">
            {/* Actual Hidden player */}

                <div className = "MP_hiddenPlayer">
                    <SpotifyPlayer 
                        autoPlay = {false}
                        play = {play}
                        token = {props.token ? props.token : null}
                        uris = {uriToPlay}
                        callback = {(state) => {
                           if(state && state.previousTracks.length > 0){
                               console.log("state", state)
                               const _playerState = {
                                    previousTrack: state.previousTracks,
                                    position: state.position, 
                                    progressMs: state.progressMs,
                                    type: state.type
                               }
                               setPlay(false)
                               setUriToPlay(null)
                               //if finished playing--> 
                               setPlayerState(_playerState);
                               setPreviousaTracks([...previousTracks, state.previousTracks[0]])
                               //check for the playlistChange--AddOrDelete
                               if(musicPlayer.playlistChanged){
                                   // check the track and the changes and update the list
                                   return 
                               }// call playNext instead
                              //musicPlayer has remained the same
                              playNext()
                              
                              
                           }
                        }}
                        styles={{
                            activeColor: '#fff',
                            bgColor: '#333',
                            color: '#202020',
                            loaderColor: '#fff',
                            sliderColor: '#1cb954',
                            trackArtistColor: '#ccc',
                            trackNameColor: '#fff',
                            sliderHeight: 4
                        }}
                    />
                </div>

                <div className = "MP_actualPlayer">
                    <div className = "MP_left">
                        <MPLeft 
                            trackDetails = {trackDetails}
                            uriToPlay = {uriToPlay} 
                        />
                    </div> 
                
                    <ul className = "MP_mid">
                        {/* <li className = "MP_shuffleBTN">
                            <button>
                                <BiShuffle />
                            </button>
                        </li>   */}
                        <li className = "MP_prevBTN MP_PrevNext">
                            <button onClick={(e) => playPrev(e)}>
                                <BiSkipPrevious/>
                            </button>
                        </li>  
                        <li className = "MP_playBTN">

                            {musicPlayer && play &&
                            <button 
                                onClick = {(e) => pauseHandler(e)}>
                                <BiPause fill = {"#000"}/>
                            </button>}

                            {musicPlayer && !play &&
                            <button 
                                onClick = {(e) => playHandler(e)}>
                                <BiPlay fill = {"#000"}/>
                            </button>}

                            {!musicPlayer &&
                            <button 
                                onClick = {(e) => playHandler(e)}>
                                <BiPlay fill = {"#000"}/>
                            </button>}
                        </li>  
                        <li className = "MP_nextBTN MP_PrevNext">
                            <button onClick={(e) => playNext(e)}>
                                <BiSkipNext/>
                            </button>
                        </li>  
                        {/* <li className = "MP_repeatBTN">
                            <button>
                                <BiRepeat />
                            </button>
                        </li>   */}
                </ul>

                <div className = "MP_right">
                    <button className = "MP_volumeBTN">
                    </button>
                </div>  
            </div>        

        </div>
    )
}