import Color from 'color';
import { ScriptRole, RoleType, Role } from './types';
import download from 'image-downloader';
import { cwd } from 'process';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

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
            dest: filepath,
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
    public async colourizeRole<R extends Role>(
        role: R,
        tempPath: string,
        preGen: boolean = false,
        modern: boolean = false,
        colorize: boolean = true,
    ): Promise<R> {
        if (!preGen) {
            const preGenPath = modern
                ? path.resolve(
                      __dirname,
                      [
                          'assets',
                          'roles',
                          'colorised',
                          'modern',
                          role.id + '.png',
                      ].join(path.sep),
                  )
                : path.resolve(
                      __dirname,
                      [
                          'assets',
                          'roles',
                          'colorised',
                          'classic',
                          role.id + '.png',
                      ].join(path.sep),
                  );

            if (fs.existsSync(preGenPath)) {
                return {
                    ...role,
                    image: preGenPath,
                };
            }
        }

        if (!role.image) {
            if (role.team === 'demon' || role.team === 'minion')
                role.image = path.join(
                    __dirname,
                    '/assets/roles/default/evil.png',
                );
            else
                role.image = path.join(
                    __dirname,
                    '/assets/roles/default/good.png',
                );
        }
        const colour = role.colour ? role.colour : getDefaultColor(role.team);
        tempPath = path.resolve(__dirname, tempPath);
        const imageFilePath = `${tempPath}/${role.id}.png`;

        if (isUrl(role.image))
            try {
                role.image = await downloadImage(role.image, tempPath);
            } catch (error) {
                throw (
                    'Unable to download custom role image from url: ' +
                    role.image
                );
            }
        else {
            if (modern) {
                role.image = role.image.replace('classic', 'modern');
            }
        }

        if (colorize) {
            const roleImage = await sharp(role.image)
                .resize({ width: 539, height: 539 })
                .toBuffer();

            await sharp(path.join(__dirname, './assets/textures/Black.png'))
                .composite([{ input: roleImage, blend: 'dest-in' }])
                .tint(Color(colour).object())
                .toFile(imageFilePath);
        }

        return { ...role, image: colorize ? imageFilePath : role.image };
    }

    public async colourizeCover(
        colour: string,
        tempPath: string,
    ): Promise<string> {
        const imagePath = path.resolve(__dirname, `${tempPath}/cover.png`);
        try {
            const parchmentTexture = await sharp(
                path.join(__dirname, '/assets/backgrounds/parchment.jpg'),
            )
                .resize({ width: 2492, height: 3780 })
                .toBuffer();
            const filigreeTexture = await sharp(
                path.join(__dirname, '/assets/backgrounds/BackBase-tiled.png'),
            )
                .resize({ width: 2492, height: 3780 })
                .toBuffer();
            const greyTexture = await sharp(
                path.join(__dirname, '/assets/backgrounds/grey.png'),
            )
                .resize({ width: 2492, height: 3780 })
                .toBuffer();
            await sharp(greyTexture)
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
        } catch (error) {
            console.error('Error:', error);
        }

        return imagePath;
    }
}
