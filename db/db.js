import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect(`mongodb://localhost:27017`)
    .then(() => {
      console.log("DB Connected Succesfully");
    })
    .catch((error) => {
      console.log("DB Failed to connect", error);
    });
}