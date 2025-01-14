import fs from 'fs';
import ImageProcessor from './imageProcessor';
import RoleData from './data/roles.json';
import { ScriptRole } from './types';
import path from 'path';

const basePath = path.resolve(__dirname, './assets/roles/colorised');
if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
const classicPath = basePath + '/classic';
if (!fs.existsSync(classicPath)) fs.mkdirSync(classicPath);
const modernPath = basePath + '/modern';
if (!fs.existsSync(modernPath)) fs.mkdirSync(modernPath);
const roleData: ScriptRole[] = RoleData as ScriptRole[];
const imageProcessor = new ImageProcessor();
Promise.all(
    roleData.map(async (role: ScriptRole): Promise<ScriptRole> => {
        return await imageProcessor.colourizeRole(role, classicPath, true);
    }),
).then(() => console.log('Generated images for classic tokens'));
Promise.all(
    roleData.map(async (role: ScriptRole): Promise<ScriptRole> => {
        return await imageProcessor.colourizeRole(role, modernPath, true, true);
    }),
).then(() => console.log('Generated images for modern tokens'));
