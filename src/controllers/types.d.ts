import { Role } from '../data/types';

export interface GetPdfResponse {
    pdf: Buffer;
}

export interface GetPdfRequest {
    name: string;
    colour: string;
    type: 'teenseyville' | 'ravenswood-bluff' | 'phobos';
    townsfolk: Role[];
    outsiders: Role[];
    minions: Role[];
    demons: Role[];
    fabled: Role[];
}

export interface PingResponse {
    message: String;
}
