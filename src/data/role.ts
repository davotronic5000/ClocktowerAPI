import { Role } from './types';
import rolesData from './roles.json';
import hatredData from './hatred.json';

export const getRoles = (): Role[] =>
    rolesData.map((role) => ({
        ...role,
        hatred: hatredData.find((i) => i.id === role.id)?.hatred,
    }));
