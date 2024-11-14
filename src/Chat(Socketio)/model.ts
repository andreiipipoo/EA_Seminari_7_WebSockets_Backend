import { Document } from 'mongoose';

export interface IChat extends Document {
    user: string;
    message: any; // Canviem el tipus a "any" per permetre JSON
    date: Date;
}