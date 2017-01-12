import axios from 'axios';

export const REGISTER_STAGE = 'REGISTER_STAGE';
export const REMOVE_STAGE = 'REMOVE_STAGE';
export const FETCH_DATA = 'FETCH_DATA';

export function registerStage (payload) {
    return {
        type: REGISTER_STAGE,
        payload
    }
}

export function removeStage (payload) {
    return {
        type: REMOVE_STAGE,
        payload
    }
}

export function fetchData () {
    let url = 'https://jsonplaceholder.typicode.com/posts';
    let request = axios.get(url);

    return {
        type: FETCH_DATA,
        payload: request
    }
}
