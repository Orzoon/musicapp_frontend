import { Link } from "react-router-dom"
export default function NavPlaylist({item}){
    console.log("item", item)
    return(
        <li>
            <Link to ={`/app/playlist/${item.id}`}>{item.name}</Link>
        </li>
    )
}
