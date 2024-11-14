import mongoose, { Schema } from "mongoose";
import { IChat } from './model'

const chatSchema: Schema = new Schema({
    user: { type: String, required: true },
    message: { type: Schema.Types.Mixed, required: true }, // Canviem el tipus a "Schema.Types.Mixed" per permetre JSON
    date: { type: Date, default: Date.now }
});

export default mongoose.model<IChat>('Chat', chatSchema);