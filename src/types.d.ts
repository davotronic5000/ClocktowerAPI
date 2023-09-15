export interface GetScriptBody {
    name: string;
    colour: string;
    type: ScriptType;
    roles: ScriptRole[];
    modern?: boolean;
    colourise?: boolean;
}

export interface GetTokensBody {
    roles: TokenRole[];
    modern?: boolean;
    roleTokenSize?: number;
    reminderTokenSize?: number;
    tokenGutter?: number;
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

export interface TokenInfo {
    id: string;
    image?: string;
    name?: string;
    leaves: {
        firstNight: boolean;
        otherNight: boolean;
        setup: boolean;
        reminders: number;
    };
}

export interface LayoutToken {
    type: 'role' | 'reminder';
    id: string;
    text?: string;
}

export type PageLayout = LayoutToken[][][];

export interface TokenData {
    layoutSizes: {
        role: {
            tokenSize: number;
            tokenAreaSize: number;
            layoutCirclePath: string;
        };
        reminder: {
            tokenSize: number;
            tokenAreaSize: number;
            layoutCirclePath: string;
        };
        pageHeight: number;
        pageWidth: number;
        printableHeight: number;
        printableWidth: number;
    };
    tokenPages: PageLayout;
    roleData: { [key: string]: TokenInfo };
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
