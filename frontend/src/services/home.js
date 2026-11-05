import api, {myapi} from './api.js';

export async function getAllTickSightings() {
    const response = await api.get("/tick-sightings")
    return response.data;
}

export async function getTickSighting(sighting_id) {
    const response = await api.get("/tick-sightings/", {sighting_id})
    return response.data
}

export async function getCityTickSighting(city) {
    const response = await api.get("/tick-sightings/city/", {city})
    return response.data
}

export async function getSpeciesTickSightings(species) {
    const response = await api.get("/tick-sightings/species/", {species})
    return response.data
}

export async function createNewSighting(date, location, species, latinName) {
    const response = await myapi.post("/", {
        date : date,
        location : location,
        species : species,
        latin_name : latinName
    })
    return response.data
}