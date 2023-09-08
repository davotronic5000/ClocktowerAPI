import RoleData from './data/roles.json';
import HatredData from './data/hatred.json';
import NightInfo from './data/nightInfo.json';
import FabledData from './data/fabled.json';
import { GetScriptBody, ScriptRole, RoleType, ScriptData } from './types';
import ImageProcessor from './imageProcessor';

const roleData: ScriptRole[] = RoleData.map((role) => ({
    ...role,
    team: role.team as RoleType,
    hatred: HatredData.find((hatred) => hatred.id === role.id)?.hatred,
}));

const fabledData: ScriptRole[] = FabledData.map((role) => ({
    ...role,
    team: role.team as RoleType,
}));

const getRoleFromRawRole = (rawRole: ScriptRole): ScriptRole => {
    const role = roleData.find(
        (i) => i.id.toLowerCase() === rawRole.id.replace('_', '').toLowerCase(),
    );
    const fabled = fabledData.find(
        (i) => i.id.toLowerCase() === rawRole.id.replace('_', '').toLowerCase(),
    );

    if (fabled) return { id: fabled.id, team: fabled.team };

    if (!role) {
        return rawRole;
    }

    return {
        id: role.id,
        image: rawRole.image || role.image,
        name: rawRole.name || role.name,
        team: rawRole.team || role.team,
        firstNight: rawRole.firstNight || role.firstNight,
        firstNightReminder:
            rawRole.firstNightReminder || role.firstNightReminder,
        otherNight: rawRole.otherNight || role.otherNight,
        otherNightReminder:
            rawRole.otherNightReminder || role.otherNightReminder,
        ability: rawRole.ability || role.ability,
        hatred: rawRole.hatred || role.hatred,
        colour: rawRole.colour,
    };
};

const filterNightActions = (order: number | undefined) =>
    typeof order === 'number' && order > 0;

const sortNightOrder = (a: number, b: number) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

export default class ScriptProcessor {
    public async processScript(
        model: GetScriptBody,
        tempPath: string,
    ): Promise<ScriptData> {
        const roles: ScriptRole[] = model.roles.map((rawRole: ScriptRole) =>
            getRoleFromRawRole(rawRole),
        );

        const imageProcessor = new ImageProcessor();
        const colorizedRoles = await Promise.all(
            roles
                .filter(
                    (role: ScriptRole) =>
                        role.team !== 'fabled' && role.team !== 'traveler',
                )
                .map(async (role: ScriptRole): Promise<ScriptRole> => {
                    return await imageProcessor.colourizeRole(
                        role,
                        tempPath,
                        false,
                        model.modern,
                        model.colourise,
                    );
                }),
        );

        const nightOrderRoles = colorizedRoles.concat(
            NightInfo as ScriptRole[],
        );

        return {
            ...model,
            townsfolk: colorizedRoles.filter(
                (role: ScriptRole) => role.team === 'townsfolk',
            ),
            outsiders: colorizedRoles.filter(
                (role: ScriptRole) => role.team === 'outsider',
            ),
            minions: colorizedRoles.filter(
                (role: ScriptRole) => role.team === 'minion',
            ),
            demons: colorizedRoles.filter(
                (role: ScriptRole) => role.team === 'demon',
            ),
            nightOrder: {
                firstNight: nightOrderRoles
                    .filter((role) => filterNightActions(role.firstNight))
                    .sort((roleA, roleB) =>
                        sortNightOrder(
                            roleA.firstNight || 0,
                            roleB.firstNight || 0,
                        ),
                    ),
                otherNight: nightOrderRoles
                    .filter((role) => filterNightActions(role.otherNight))
                    .sort((roleA, roleB) =>
                        sortNightOrder(
                            roleA.otherNight || 0,
                            roleB.otherNight || 0,
                        ),
                    ),
            },
            coverImage: await imageProcessor.colourizeCover(
                model.colour,
                tempPath,
            ),
        };
    }
}
