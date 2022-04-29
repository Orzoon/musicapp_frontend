

import SpotifyWebApi from "spotify-web-api-js";

let baseURL = "https://accounts.spotify.com/authorize?"
let client_id = "24c6bba76c5a4dd09f653175d7c01484";
let response_type = "token";
let redirect_uri = "http://localhost:3000/";
const scopes = [
    "app-remote-control",
    "streaming",
    "user-read-email",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-read-playback-position",
    "user-top-read",
    "user-modify-playback-state",
    "playlist-modify-public",
    "user-library-modify",
    "user-library-read",
    "playlist-read-private",
    "user-read-private",
    "playlist-modify-private"
  ];


const spotifyApi = new SpotifyWebApi();

function loginAuth(){
    return `${baseURL}client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join(
        "%20"
      )}&response_type=${response_type}&show_dialog=true`
}


function checkAuth(){
    // returns true
    // if(window.localStorage.getItem("musicAppUserCode")){
    //     console.log(window.localStorage.getItem("musicAppUserCode"))
    //     return true
    // }
    // return false
    
}


/* MILLISECOND TO TIME */
function milliSecondToTime(milli_seconds, value = false){
    let h,m,s;
    h = Math.floor(milli_seconds/1000/60/60);
    m = Math.floor((milli_seconds/1000/60/60 - h)*60);
    s = Math.floor(((milli_seconds/1000/60/60 - h)*60 - m)*60);
    
    if(value){
        if(h !== 0){
            return `${h} hr ${m} min ${s} s`
        }

        if(h === 0 && m !== 0){
            return `${m} min ${s} s`
        }
        return  `${s} s`
    }
    if(h ===0) return [m,s]
    return [h,m,s]
    
}


function debounceHelper(func, delay){
    let debounceHelperID;

    return function(...args){
        if(debounceHelperID){
            clearTimeout(debounceHelperID)
        }
        debounceHelperID = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

export {
    loginAuth,
    checkAuth,
    spotifyApi,
    milliSecondToTime,
    debounceHelper
}