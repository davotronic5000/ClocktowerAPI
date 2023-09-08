import RoleData from './data/roles.json';
import FabledData from './data/fabled.json';
import {
    RoleType,
    GetTokensBody,
    TokenRole,
    TokenData,
    TokenInfo,
    PageLayout,
    LayoutToken,
} from './types';
import ImageProcessor from './imageProcessor';
import { defaultTokenSize, pageSize } from './global-variables';

const roleData: TokenRole[] = RoleData.map((role) => ({
    ...role,
    team: role.team as RoleType,
}));

const fabledData: TokenRole[] = FabledData.map((role) => ({
    ...role,
    team: role.team as RoleType,
}));

const getRoleFromRawRole = (rawRole: TokenRole): TokenRole => {
    const role = roleData.find(
        (i) => i.id.toLowerCase() === rawRole.id.replace('_', '').toLowerCase(),
    );
    const fabled = fabledData.find(
        (i) => i.id.toLowerCase() === rawRole.id.replace('_', '').toLowerCase(),
    );

    if (fabled) return { id: fabled.id, team: fabled.team, count: 1 };

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

const workOutLayoutSizes = (
    roleTokenSize = defaultTokenSize.role,
    reminderTokenSize = defaultTokenSize.reminder,
    tokenMargin = defaultTokenSize.margin,
): TokenData['layoutSizes'] => {
    const printableAreaWidth = pageSize.width - pageSize.pageMargin * 2;
    const printableAreaHeight = pageSize.height - pageSize.pageMargin * 2;
    return {
        pageHeight: pageSize.height,
        pageWidth: pageSize.width,
        printableHeight: printableAreaHeight,
        printableWidth: printableAreaWidth,
        role: {
            tokenSize: roleTokenSize,
            tokenAreaSize: roleTokenSize + tokenMargin * 2,
        },
        reminder: {
            tokenSize: reminderTokenSize,
            tokenAreaSize: reminderTokenSize + tokenMargin * 2,
        },
    };
};

const layoutTokens = (
    layoutSizes: TokenData['layoutSizes'],
    tokens: TokenRole[],
) => {
    const { roles, reminderList, roleList } = tokens.reduce(
        (acc, curr) => {
            const roles = {
                ...acc.roles,
                [curr.id]: {
                    id: curr.id,
                    image: curr.image,
                    name: curr.name,
                    leaves: {
                        firstNight: !!curr.firstNight,
                        otherNight: !!curr.otherNight,
                        setup: !!curr.setup,
                        reminders:
                            curr.reminders?.reduce((a, c) => a + c.count, 0) ||
                            0,
                    },
                },
            };
            for (let i = 0; i < curr.count; i++) {
                acc.roleList.push(curr.id);
            }
            curr.reminders?.forEach((reminder) => {
                for (let p = 0; p < reminder.count; p++) {
                    acc.reminderList.push({ id: curr.id, text: reminder.text });
                }
            });
            return {
                ...acc,
                roles,
            };
        },
        {
            roles: {} as { [key: string]: TokenInfo },
            roleList: [] as string[],
            reminderList: [] as { id: string; text: string }[],
        },
    );
    const { printableWidth, printableHeight } = layoutSizes;
    let availablePageSpace = printableHeight;
    let availableRowSpace = printableWidth;
    let currentPage = 0;
    let currentRow = 0;
    const pageLayout: PageLayout = [];
    const addTokenToPage = (
        { id, text }: { id: string; text?: string },
        type: 'role' | 'reminder',
    ) => {
        const token: LayoutToken = { type: type, id, text };
        const tokenSize = layoutSizes[type].tokenAreaSize;
        if (!pageLayout.length) {
            pageLayout.push([[]]);
            availablePageSpace -= tokenSize;
        }
        if (availableRowSpace > tokenSize) {
            pageLayout[currentPage][currentRow].push(token);
            availableRowSpace -= tokenSize;
        } else {
            const newRow = [token];
            if (availablePageSpace > tokenSize) {
                pageLayout[currentPage].push(newRow);
                currentRow++;
                availablePageSpace -= tokenSize;
                availableRowSpace = printableWidth - tokenSize;
            } else {
                pageLayout.push([newRow]);
                currentPage++;
                currentRow = 0;
                availablePageSpace = printableHeight - tokenSize;
                availableRowSpace = printableWidth - tokenSize;
            }
        }
    };
    roleList.forEach((id) => addTokenToPage({ id }, 'role'));
    reminderList.forEach((tokenData) => addTokenToPage(tokenData, 'reminder'));
    return { pageLayout, roles };
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
                    (role: TokenRole) =>
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

        const layoutSizes = workOutLayoutSizes();
        const tokenPages = layoutTokens(layoutSizes, colorizedRoles);

        return {
            layoutSizes,
            tokenPages: tokenPages.pageLayout,
            roleData: tokenPages.roles,
        };
    }
}
