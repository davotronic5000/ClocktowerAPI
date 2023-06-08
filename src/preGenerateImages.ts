import fs from 'fs';
import ImageProcessor from './imageProcessor';
import RoleData from './data/roles.json';
import { Role } from './types';
import { image } from 'image-downloader';

const basePath = 'src/assets/roles/colorised';
if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
const classicPath = basePath + '/classic';
if (!fs.existsSync(classicPath)) fs.mkdirSync(classicPath);
const modernPath = basePath + '/modern';
if (!fs.existsSync(modernPath)) fs.mkdirSync(modernPath);
const roleData: Role[] = RoleData as Role[];

const imageProcessor = new ImageProcessor();
Promise.all(
    roleData.map(async (role: Role): Promise<Role> => {
        return await imageProcessor.colourizeRole(role, classicPath, true);
    }),
).then(() => console.log('Generated images for classic tokens'));
Promise.all(
    roleData.map(async (role: Role): Promise<Role> => {
        return await imageProcessor.colourizeRole(role, modernPath, true, true);
    }),
).then(() => console.log('Generated images for modern tokens'));
