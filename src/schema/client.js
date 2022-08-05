import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ClientScheme = new Schema({
    id_client: Number,
    cedula: Number,
    name_client: String,
    lastname_client: String,
    direccion: String,
    status: {
        tipo: Boolean,
        default: false
    }
});

export default mongoose.model('client', ClientScheme);