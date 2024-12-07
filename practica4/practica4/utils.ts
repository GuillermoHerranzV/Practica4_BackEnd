
import type { vehicle,modelVehicle, modelPart,part } from "./types.ts";


export const fromModelToVehicle  = (vehiculo: modelVehicle):vehicle=>{
    return  {
        id:vehiculo._id!.toString(),
        name: vehiculo.name,
        manufacturer:vehiculo.manufacturer,
        date:vehiculo.date,
    }
}


export const fromModelToPart=(part: modelPart):part=>{
    return{
        id:part._id!.toString(),
        name:part.name,
        price: part.price,
        vehiculoId: part.vehiculoId.toString(),
    }
}

export const getJoke = async ():Promise<string> => {
    const apiUrl = 'https://official-joke-api.appspot.com/random_joke';
    
    try {
        // Solicitud a la API
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Error al obtener la broma: ${response.statusText}`);
        }

        const joke = await response.json();

        return 'Setup: ' + joke.setup + ' - Punchline: ' + joke.punchline;
    } catch (_error) {
        // Manejo de errores
        return "Error al obtener la broma";
    }
};