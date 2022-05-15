const InitialState = {
    user: null,
    home: [],
    search: null,
    likedSongs: null,
    playlists: [],
    musicPlayer: null,
    notification: [], //array of object id:, :message
    loadingDataNames: []
}

export default function appReducer(state, action){
    switch(action.type){
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            }
        /* --HOME-- */
        /***********/
        /********/
        case "SET_RECENTLY_PLAYED":
            return {
                ...state,
                home: [...state.home, action.payload]
            }
        case "SET_FRESH_NEW_MUSIC":
            return {
                ...state,
                home: [...state.home, action.payload]
            }

        case "SET_MOOD":
            return {
                ...state,
                home: [...state.home, action.payload]
            }
        case "SET_POP":
            return {
                ...state,
                home: [...state.home, action.payload]
            }
        case "SET_WORKOUT":
            return {
                ...state,
                home: [...state.home, action.payload]
            }
        case "SET_CHILL":
            return {
                ...state,
                home: [...state.home, action.payload]
            }
        case "SET_HIPHOP":
                return {
                    ...state,
                    home: [...state.home, action.payload]
                } 
        case "SET_WELLNESS":
            return {
                ...state,
                home: [...state.home, action.payload]
            }   
        case "SET_GAMING":
            return {
                ...state,
                home: [...state.home, action.payload]
            }  
        case "SET_PARTY":
            return {
                ...state,
                home: [...state.home, action.payload]
            }  
        /* --PLAYLISTS-- */
        /***********/
        /********/
        case "SET_PLAYLIST":
            return {
                ...state,
                playlists: action.payload
            }
        case 'SET_SAVEDTRACKS':
            return {
                ...state, 
                likedSongs: action.payload
            }
        case "SET_MUSICPLAYER":
            return {
                ...state,
                musicPlayer: action.payload
            }
        case "SET_SEARCH":
            return {
                ...state,
                search: action.payload
            }
        case 'SET_NOTIFICATION':
            return {
                ...state,
                notification: action.payload
            }
        case 'SET_LOADINGDATA':
            return {
                ...state,
                loadingDataNames: [...state.loadingDataNames, action.payload]
            }           
        default: 
        return state
    }

}

export {
    InitialState
}