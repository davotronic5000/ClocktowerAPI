import { Role } from '../data/types';
import { getRoles } from '../data/role';
import { GetPdfRequest } from '../controllers/types';

const roleData = getRoles();

const GetRoleFromRawRole = (rawRole: Role) => {
    const role = roleData.find((i) => i.id === rawRole.id.replace('_', ''));

    if (!role) return rawRole;

    return {
        id: role.id,
        image: rawRole.image || role.image,
        name: rawRole.name || role.name,
        edition: rawRole.edition || role.edition,
        team: rawRole.team || role.team,
        firstNight: rawRole.firstNight || role.firstNight,
        firstNightReminder:
            rawRole.firstNightReminder || role.firstNightReminder,
        otherNight: rawRole.otherNight || role.otherNight,
        otherNightReminder:
            rawRole.otherNightReminder || role.otherNightReminder,
        reminder: rawRole.reminders || role.reminders,
        setup: rawRole.setup || role.setup,
        ability: rawRole.ability || role.ability,
        hatred: rawRole.hatred || role.hatred,
    };
};

export const processScript = (rawScript: GetPdfRequest): GetPdfRequest => {
    const townsfolk = rawScript.townsfolk.map((rawRole: Role) =>
        GetRoleFromRawRole(rawRole),
    );
    const outsiders = rawScript.outsiders.map((rawRole: Role) =>
        GetRoleFromRawRole(rawRole),
    );
    const minions = rawScript.minions.map((rawRole: Role) =>
        GetRoleFromRawRole(rawRole),
    );
    const demons = rawScript.demons.map((rawRole: Role) =>
        GetRoleFromRawRole(rawRole),
    );

    return {
        ...rawScript,
        townsfolk: townsfolk,
        outsiders: outsiders,
        minions: minions,
        demons: demons,
    };
};
