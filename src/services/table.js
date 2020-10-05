import axios from 'axios'
import { END_POINT } from '../constants'


export const tables = async () => {
    try {
        const tables = await axios.get(`${END_POINT}/tables`);
        if (tables) {
            let data = tables?.data;
            return data;
        } else {
            return null;
        }

    } catch (error) {
        console.log("get tables error:", error)
    }
}