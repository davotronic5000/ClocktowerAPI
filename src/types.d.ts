export interface GetScriptBody {
    name: string;
    colour: string;
    type: ScriptType;
    roles: ScriptRole[];
    modern?: boolean;
}

export interface GetTokensBody {
    roles: TokenRole[];
    modern?: boolean;
}

export interface Role {
    id: string;
    name?: string;
    team?: RoleType;
    firstNight?: number;
    otherNight?: number;
    image?: string;
    colour?: string;
}

export interface ScriptRole extends Role {
    firstNightReminder?: string;
    otherNightReminder?: string;
    ability?: string;
    hatred?: Hatred[];
}

export interface TokenReminder {
    text: string;
    count: number;
}

export interface TokenRole extends Role {
    reminders?: TokenReminder[];
    setup?: boolean;
    count: number;
}

export interface Hatred {
    id: string;
    reason: string;
}

export interface ScriptData {
    name: string;
    colour: string;
    type: ScriptType;
    townsfolk: ScriptRole[];
    outsiders: ScriptRole[];
    minions: ScriptRole[];
    demons: ScriptRole[];
    nightOrder: NightOrder;
    coverImage: string;
}

export interface TokenData {
    roles: TokenRole[];
}

export interface NightOrder {
    firstNight: ScriptRole[];
    otherNight: ScriptRole[];
}

export type ScriptType = 'teenseyville' | 'ravenswood-bluff' | 'phobos';
export type RoleType =
    | 'townsfolk'
    | 'outsider'
    | 'minion'
    | 'demon'
    | 'fabled'
    | 'traveler';
