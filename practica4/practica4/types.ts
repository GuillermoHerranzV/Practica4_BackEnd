import {OptionalId, ObjectId}from"mongodb"


export type part={
    id:string,
    name: string,
    price: number,
    vehiculoId: string,
}

export type modelPart=OptionalId<{
    name: string,
    price: number,
    vehiculoId: ObjectId,
}>

export type vehicle ={
    id: string,
    name: string,
    manufacturer: string,
    date: number,
}


export type modelVehicle =OptionalId<{
    name: string,
    manufacturer: string,
    date: number
}>

export type vehiculoYbroma={
    vehicle: vehicle,
    joke: string,
    parts: part[]
}