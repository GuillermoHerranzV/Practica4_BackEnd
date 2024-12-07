import type{part,modelPart, vehicle, modelVehicle, vehiculoYbroma} from "./types.ts"
import{Collection,ObjectId}from "mongodb"
import { fromModelToPart,fromModelToVehicle, getJoke } from "./utils.ts"

export const resolvers ={
    Query:{
        vehicles: async (
            _: unknown,
            __: unknown,
            context: { 
              vehiculesCollection: Collection<modelVehicle>, 
              partsCollection: Collection<modelPart> // Asegúrate de tener la colección de partes en el contexto
            }
          ): Promise<vehiculoYbroma[]> => {
            const vehiculosModelo = await context.vehiculesCollection.find().toArray();
            
            const results = await Promise.all(
              vehiculosModelo.map(async (vehiculo: modelVehicle) => {
                const vehicle = fromModelToVehicle(vehiculo);
                const joke = await getJoke();
          
                // Buscar las partes que coincidan con el ID del vehículo
                const parts = await context.partsCollection.find({ vehiculoId: new ObjectId(vehicle.id) }).toArray();
                const partsMapped = parts.map((part: modelPart) => fromModelToPart(part));
                return {
                  vehicle,
                  joke,
                  parts: partsMapped, // Incluir las partes encontradas en la respuesta
                };
              })
            );
          
            return results;
          },
          
       vehicle:async(
        _:unknown,
        { id }:{id:string},
        context:{vehiclesCollection:Collection<modelVehicle>; partsCollection:Collection<modelPart>;}
       ):Promise<vehiculoYbroma|null>=>{
        const vehiculoModelo = await context.vehiclesCollection.findOne({
            _id: new ObjectId (id),
        });
        if(!vehiculoModelo){
            return null;
        }

        const partesModelo = await context.partsCollection.find ({vehiculoId: new ObjectId (id),}).toArray ();
        const vehiculo = fromModelToVehicle (vehiculoModelo);
        const partes = partesModelo.map ((partes) => fromModelToPart (partes));
        const broma = await getJoke ();

        return {vehicle: vehiculo, joke: broma, parts: partes};
        
       },

       parts:async(
        _:unknown,
        __:unknown,
        context:{partsCollection: Collection<modelPart>}
       ):Promise<part[]> =>{
        const partsModelo = await context.partsCollection.find().toArray();
        return partsModelo.map((part: modelPart)=>fromModelToPart(part))
       },

       vehiclesByManufacturer: async (
        _: unknown,
        args: { manufacturer: string },
        context: { vehiculesCollection: Collection<modelVehicle> }
      ): Promise<vehiculoYbroma[]> => {
        const vehiculosModelo = await context.vehiculesCollection.find({ manufacturer: args.manufacturer }).toArray();
      
        const result = await Promise.all(
         vehiculosModelo.map(async (vehiculo: modelVehicle) => {
            const vehicle = fromModelToVehicle(vehiculo); 
            const joke = await getJoke(); 
            return {
              vehicle,
              joke,
              parts: [], 
            };
          })
        );
      
        return result;
      },
      
      
      
       partsByVehicle:async(
        _:unknown,
        args:{vehiculoId:string},
        context:{partsCollection:Collection<modelPart>}
       ):Promise<part[]> =>{
        const partsModelo = await context.partsCollection.find(args).toArray();
        return partsModelo.map((part:modelPart)=>fromModelToPart(part))
       },

       vehiclesByYearRange:async(
        _:unknown,
        args:{startYear:number,EndYear: number},
        context:{vehiculesCollection:Collection<modelVehicle>},
       ):Promise<vehicle[]> =>{
        const vehiculosModelo = await context.vehiculesCollection.find().toArray()
        return vehiculosModelo.map((vehiculo)=>fromModelToVehicle(vehiculo)).filter((vehiculo)=>{
            if(vehiculo.date >= args.startYear && vehiculo.date <= args.EndYear) return vehiculo
        })
       },
    },
    Mutation:{
        addVehicle:async(
            _:unknown,
            args:{name:string, manufacturer:string, year:number},
            context:{vehiculesCollection:Collection<modelVehicle>},
        ):Promise<vehicle>=>{
            const {insertedId} = await context.vehiculesCollection.insertOne({
                name:args.name,
                manufacturer:args.manufacturer,
                date: args.year,
            });

            const vehiculoInsertado = {
                id:insertedId.toString(),
                name:args.name,
                manufacturer:args.manufacturer,
                date:args.year,
            }
            return vehiculoInsertado;
        },

        addPart:async(
            _:unknown,
            args:{name: string, price: number, vehicleId:string},
            context:{partsCollection:Collection<modelPart>}
        ):Promise<part>=>{
            const {insertedId} = await context.partsCollection.insertOne({
                name:args.name,
                price:args.price,
                vehiculoId: new ObjectId (args.vehicleId),
            });

            const partInsertado = {
                id:insertedId.toString(),
                name:args.name,
                price:args.price,
                vehiculoId:args.vehicleId,
            }
            return partInsertado;
        },

        updateVehicle:async(
            _:unknown,
            args:{id:string, name: string, manufacturer: string, year:number},
            context:{vehiculesCollection:Collection<modelVehicle>},
        ):Promise<Response>=>{
            const { modifiedCount } = await context.vehiculesCollection.updateOne(
                { _id:new ObjectId(args.id)},
                { $set: { name: args.name, manufacturer: args.manufacturer, date: args.year } }
              );
            if(modifiedCount===0){
                return new Response("Vehicule not found")
            }     
            return new Response("Vehicule updated")      
        },

        deletePart:async(
            _:unknown,
            args:{id:string},
            context:{partsCollection:Collection<modelPart>},
        ):Promise<Response>=>{
            const { deletedCount } = await context.partsCollection.deleteOne({
                _id: new ObjectId(args.id),
            });
            if(deletedCount===0){
                return new Response("Part not found")
            }
            return new Response("Part deleted")
        }
    }
}

