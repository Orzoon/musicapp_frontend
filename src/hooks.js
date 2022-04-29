import React,{useEffect, useState} from 'react';

import { 
    spotifyApi,
    debounceHelper } from './helper';


function usePlaylistFindMore(){
    const [loading, setLoading] = useState(null);
    const [errors, setErros] = useState({})
    const [searchTracks, setSearchTracks] = useState([])

    const onFindMoreFormChangeHandler = debounceHelper((inputValue) => {
        //making api Call to get searchAlbums--> Tracks
        /* Getting Tracks Only */
        if(inputValue.length === 1 || inputValue === ""){
            setSearchTracks([])
            return
        }
        spotifyApi.searchTracks(inputValue, {limit: 10})
        .then(tracksData => {
           // setting tracks
           setSearchTracks(tracksData.tracks.items)
        })

    }, 1000)


  return {
      loading, 
      errors,
      searchTracks, 
      onFindMoreFormChangeHandler}
}

function useWindowWidthResize(){
    const [windowWidth, setWindowWidth] = useState(null)



    useEffect(() => {
     
        window.addEventListener('resize', serWidthHandler)  
        return null
    })


    function serWidthHandler(){
        setWindowWidth(window.innerWidth)
    }
    return {}
}
/* Exporting Hooks */
export {
    usePlaylistFindMore
}