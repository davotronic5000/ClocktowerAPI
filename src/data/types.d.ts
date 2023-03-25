export interface Role {
    id: string;
    name?: string;
    edition?: string;
    team?: string;
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
}
