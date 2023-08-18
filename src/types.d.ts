export interface GetScriptBody {
    name: string;
    colour: string;
    type: ScriptType;
    roles: Role[];
    modern?: boolean;
}

export interface Role {
    id: string;
    name?: string;
    edition?: string;
    team?: RoleType;
    firstNight?: number;
    firstNightReminder?: string;
    otherNight?: number;
    otherNightReminder?: string;
    reminders?: string[];
    setup?: boolean;
    ability?: string;
    image?: string;
    remindersGlobal?: string[];
    colour?: string;
    hatred?: Hatred[];
}

export interface Hatred {
    id: string;
    reason: string;
    image?: string;
}

export interface ScriptData {
    name: string;
    colour: string;
    type: ScriptType;
    townsfolk: Role[];
    outsiders: Role[];
    minions: Role[];
    demons: Role[];
    nightOrder: NightOrder;
    coverImage: string;
}

export interface NightOrder {
    firstNight: Role[];
    otherNight: Role[];
}

export type ScriptType = 'teenseyville' | 'ravenswood-bluff' | 'phobos';
export type RoleType =
    | 'townsfolk'
    | 'outsider'
    | 'minion'
    | 'demon'
    | 'fabled'
    | 'traveler';
