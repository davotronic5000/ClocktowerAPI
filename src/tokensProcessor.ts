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
    TokenProcessingVariables,
} from './types';
import ImageProcessor from './imageProcessor';
import { defaultTokenSize } from './global-variables';

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
        setup: rawRole.setup || role.setup,
        colour: rawRole.colour,
        count: rawRole.count || role.count || 1,
    };
};

const createCircle = (cx: number, cy: number, r: number, deg: number) => {
    var theta = (deg * Math.PI) / 180,
        dx = r * Math.cos(theta),
        dy = -r * Math.sin(theta);
    return `
        M ${cx} ${cy}
        m ${dx},${dy}
        a ${r},${r} 0 1,0 ${-2 * dx},${-2 * dy}
        a ${r},${r} 0 1,0 ${2 * dx},${2 * dy}
    `;
};

const workOutLayoutSizes = ({
    page,
    tokens,
    styles,
}: TokenProcessingVariables = defaultTokenSize): TokenData['layoutSizes'] => {
    const printableAreaWidth = page.width - page.margin * 2;
    const printableAreaHeight = page.height - page.margin * 2;
    const roleCircleSize =
        (tokens.role.size -
            tokens.role.imageMarginY -
            (styles.border.circleBorder ? styles.border.thickness : 0)) /
        2;
    const roleMidPoint = tokens.role.size / 2;
    const reminderCircleSize =
        (tokens.reminder.size -
            tokens.reminder.imageMarginY -
            (styles.border.circleBorder ? styles.border.thickness : 0)) /
        2;
    const reminderMidPoint = tokens.reminder.size / 2;
    return {
        pageHeight: page.height,
        pageWidth: page.width,
        printableHeight: printableAreaHeight,
        printableWidth: printableAreaWidth,
        role: {
            tokenSize: tokens.role.size,
            tokenAreaSize: tokens.role.size + tokens.margin * 2,
            tokenSquareSize:
                tokens.role.size +
                (styles.border.squareBorder ? styles.border.thickness * 2 : 0),
            layoutCirclePath: createCircle(
                roleMidPoint,
                roleMidPoint,
                roleCircleSize,
                135,
            ),
            imageSize:
                tokens.role.size -
                tokens.role.imageMarginX * 2 -
                (styles.border.squareBorder ? styles.border.thickness * 2 : 0),
            textMargin:
                tokens.role.imageMarginY +
                (styles.border.squareBorder ? styles.border.thickness : 0),
            imageMargin:
                tokens.role.imageMarginX +
                (styles.border.squareBorder ? styles.border.thickness : 0),
        },
        reminder: {
            tokenSize: tokens.reminder.size,
            tokenAreaSize: tokens.reminder.size + tokens.margin * 2,
            tokenSquareSize:
                tokens.reminder.size +
                (styles.border.squareBorder ? styles.border.thickness * 2 : 0),
            layoutCirclePath: createCircle(
                reminderMidPoint,
                reminderMidPoint,
                reminderCircleSize,
                90,
            ),
            imageSize:
                tokens.reminder.size -
                tokens.reminder.imageMarginX * 2 -
                (styles.border.squareBorder ? styles.border.thickness * 2 : 0),
            textMargin:
                tokens.reminder.imageMarginY +
                (styles.border.squareBorder ? styles.border.thickness : 0),
            imageMargin:
                tokens.reminder.imageMarginX +
                (styles.border.squareBorder ? styles.border.thickness : 0),
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
            styles: defaultTokenSize.styles,
        };
    }
}
