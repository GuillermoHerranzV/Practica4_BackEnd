import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient } from "mongodb";
import { modelVehicle, modelPart } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = "mongodb+srv://UsuarioParcial:UsuarioParcial@clusterparcial.c8i31.mongodb.net/?retryWrites=true&w=majority&appName=ClusterParcial"

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("P4_BackEnd");
const VehiculosCollection = mongoDB.collection<modelVehicle>("Vehiculos");
const PartsCollection = mongoDB.collection<modelPart>("Partes");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ VehiculosCollection, PartsCollection }),
});

console.info(`Server ready at ${url}`);
