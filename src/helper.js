
let baseURL = "https://accounts.spotify.com/authorize?"
let client_id = "24c6bba76c5a4dd09f653175d7c01484";
let response_type = "code";
let redirect_uri = "http://localhost:3000/";
let scope ="streaming%20user-read-recently-played%20playlist-read-private%20user-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private"


function loginAuth(){
    return `${baseURL}client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}`
}

export {
    loginAuth
}