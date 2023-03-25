import { GetPdfRequest } from '../controllers/types';
import { Role } from '../data/types';
import sharp from 'sharp';
import Color from 'color';
import download from 'image-downloader';
import { cwd } from 'process';

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
            let imageFilePath: string;
            if (!role.image) return role;
            imageFilePath = `${filepath}/${role.id}.png`;

            if (isUrl(role.image))
                role.image = await downloadImage(role.image, filepath);

            const color = role.colour ? role.colour : defaultColor;

            const roleImage = await sharp(role.image)
                .resize({ width: 539, height: 539 })
                .toBuffer();

            await sharp('src/assets/textures/Black.png')
                .composite([{ input: roleImage, blend: 'dest-in' }])
                .tint(Color(color).object())
                .toFile(imageFilePath);

            return { ...role, image: imageFilePath };
        }),
    );
};

const isUrl = (string: string): boolean => {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
};
const downloadImage = async (
    url: string,
    filepath: string,
): Promise<string> => {
    return (
        await download.image({
            url,
            dest: `${cwd()}/${filepath}`,
        })
    ).filename;
};
