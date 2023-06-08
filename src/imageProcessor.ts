import Color from 'color';
import { Role, RoleType } from './types';
import download from 'image-downloader';
import { cwd } from 'process';
import sharp from 'sharp';

const getDefaultColor = (roleType: RoleType | undefined) => {
    switch (roleType) {
        case 'townsfolk':
        case 'outsider':
            return '#3169b5';
        case 'minion':
        case 'demon':
            return '#4e0000';
        case 'fabled':
            return '#ffe91f';
        case 'traveler':
            return '#4B0082';
        default:
            return '#3169b5';
    }
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

const isUrl = (string: string): boolean => {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
};

export default class ImageProcessor {
    public async colourizeRole(role: Role, tempPath: string): Promise<Role> {
        if (!role.image) {
            if (role.team === 'demon' || role.team === 'minion')
                role.image = 'src/assets/roles/default/evil.png';
            else role.image = 'src/assets/roles/default/good.png';
        }
        const colour = role.colour ? role.colour : getDefaultColor(role.team);
        const imageFilePath = `${tempPath}/${role.id}.png`;

        if (isUrl(role.image))
            role.image = await downloadImage(role.image, tempPath);

        const roleImage = await sharp(role.image)
            .resize({ width: 539, height: 539 })
            .toBuffer();

        await sharp('src/assets/textures/Black.png')
            .composite([{ input: roleImage, blend: 'dest-in' }])
            .tint(Color(colour).object())
            .toFile(imageFilePath);

        return { ...role, image: imageFilePath };
    }

    public async colourizeCover(
        colour: string,
        tempPath: string,
    ): Promise<string> {
        const imagePath = `${tempPath}/cover.png`;
        const parchmentTexture = await sharp(
            'src/assets/backgrounds/parchment.jpg',
        )
            .resize({ width: 1505, height: 1502 })
            .toBuffer();
        const filigreeTexture = await sharp(
            'src/assets/backgrounds/BackBase.png',
        )
            .resize({ width: 1505, height: 1502 })
            .toBuffer();
        const paperTexture = await sharp('src/assets/textures/Black.png')
            .resize({ width: 1505, height: 1502 })
            .toBuffer();

        await sharp(paperTexture)
            .composite([
                {
                    input: parchmentTexture,
                    blend: 'saturate',
                },
                {
                    input: filigreeTexture,
                    blend: 'colour-burn',
                },
            ])
            .tint(Color(colour).object())
            .toFile(imagePath);

        return imagePath;
    }
}
