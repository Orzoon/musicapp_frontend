
let baseURL = "https://accounts.spotify.com/authorize?"
let client_id = "24c6bba76c5a4dd09f653175d7c01484";
let response_type = "token";
let redirect_uri = "http://localhost:3000/";
const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
  ];

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
export {
    loginAuth,
    checkAuth
}