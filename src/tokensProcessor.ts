import RoleData from './data/roles.json';
import {
    ScriptRole,
    RoleType,
    GetTokensBody,
    TokenRole,
    TokenData,
} from './types';
import ImageProcessor from './imageProcessor';

const roleData: TokenRole[] = RoleData.map((role) => ({
    ...role,
    team: role.team as RoleType,
}));

const getRoleFromRawRole = (rawRole: TokenRole): TokenRole => {
    const role = roleData.find(
        (i) => i.id.toLowerCase() === rawRole.id.replace('_', '').toLowerCase(),
    );

    if (!role) {
        return rawRole;
    }

    return {
        id: role.id,
        image: rawRole.image || role.image,
        name: rawRole.name || role.name,
        team: rawRole.team || role.team,
        firstNight: rawRole.firstNight || role.firstNight,
        otherNight: rawRole.otherNight || role.otherNight,
        reminders: rawRole.reminders || role.reminders,
        colour: rawRole.colour,
        count: rawRole.count || role.count,
    };
};

export default class TokensProcessor {
    public async processTokens(
        model: GetTokensBody,
        tempPath: string,
    ): Promise<TokenData> {
        const roles = model.roles.map((rawRole) => getRoleFromRawRole(rawRole));

        const imageProcessor = new ImageProcessor();
        const colorizedRoles = await Promise.all(
            roles
                .filter(
                    (role: ScriptRole) =>
                        role.team !== 'fabled' && role.team !== 'traveler',
                )
                .map(async (role: TokenRole): Promise<TokenRole> => {
                    return await imageProcessor.colourizeRole(
                        role,
                        tempPath,
                        false,
                        model.modern,
                    );
                }),
        );

        return {
            roles: colorizedRoles,
        };
    }
}
