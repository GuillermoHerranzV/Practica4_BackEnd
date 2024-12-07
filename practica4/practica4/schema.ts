export const schema = `#graphql

type Part {
  name: String!
  price: Int!
  vehiculoId: String!
}

type Vehicle {
  id: ID!
  name: String!
  manufacturer: String!
  date: String!
}

type VehiculoYbroma {
  vehicle: Vehicle!
  joke: String!
  parts: [Part]
}

type Query {
  vehicles: [VehiculoYbroma!]!
  vehicle(id: ID!): VehiculoYbroma
  parts: [Part!]!
  vehiclesByManufacturer(manufacturer: String!): [VehiculoYbroma!]!
  partsByVehicle(vehiculoId: String!): [Part!]!
  vehiclesByYearRange(startYear: Int!, endYear: Int!): [VehiculoYbroma!]!
}

type Mutation {
  addVehicle(name: String! manufacturer: String! year: Int!): Vehicle!
  addPart(name: String! price: Int! vehiculoId: String!): Part!
  updateVehicle(id: ID! name: String! manufacturer: String! year: Int!): Vehicle!
  deletePart(id: ID!): Boolean!
}
`;


