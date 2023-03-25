import { GetPdfRequest } from '../controllers/types';
import { Role } from '../data/types';
import sharp from 'sharp';
import Color from 'color';

export default class ImageFunctions {
    public async processRoleImages(
        model: GetPdfRequest,
        filepath: string,
    ): Promise<GetPdfRequest> {
        return {
            ...model,
            townsfolk: await colorizeRoles(model.townsfolk, 'good', filepath),
            outsiders: await colorizeRoles(model.outsiders, 'good', filepath),
            minions: await colorizeRoles(model.minions, 'evil', filepath),
            demons: await colorizeRoles(model.demons, 'evil', filepath),
        };
    }

    public async colorizeCover(
        colour: string,
        filePath: string,
    ): Promise<string> {
        const imagePath = `${filePath}/cover.png`;
        await sharp('src/assets/backgrounds/parchment.jpg')
            .resize({ width: 1505, height: 1502 })
            .composite([
                {
                    input: 'src/assets/backgrounds/BackBase.png',
                    blend: 'color-burn',
                },
            ])
            .tint(Color(colour).object())
            .toFile(imagePath);

        return imagePath;
    }
}

const colorizeRoles = async (
    roles: Role[],
    team: 'good' | 'evil' | 'fabled',
    filepath: string,
): Promise<Role[]> => {
    let defaultColor: string;
    switch (team) {
        case 'evil':
            defaultColor = '#4e0000';
            break;
        case 'fabled':
            defaultColor = 'ffe91f';
            break;
        default:
            defaultColor = '#3169b5';
            break;
    }

    return await Promise.all(
        roles.map(async (role: Role): Promise<Role> => {
            const imageFilePath = `${filepath}/${role.id}.png`;
            const color = role.colour ? role.colour : defaultColor;
            await sharp('src/assets/textures/Black.png')
                .composite([{ input: role.image, blend: 'dest-in' }])
                .tint(Color(color).object())
                .toFile(imageFilePath);

            return { ...role, image: imageFilePath };
        }),
    );
};
