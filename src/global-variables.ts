import { TokenProcessingVariables } from './types';

export const defaultTokenSize: TokenProcessingVariables = {
    page: {
        height: 1123,
        width: 794,
        margin: 38,
    },
    tokens: {
        margin: 10,
        role: {
            size: 151,
            imageMarginX: 10,
            imageMarginY: 10,
        },
        reminder: {
            size: 76,
            imageMarginX: 10,
            imageMarginY: 5,
        },
    },
    styles: {
        fontColour: '#262626',
        setup: {
            icon: '&#10010;',
            colour: ' #cc0000',
        },
        firstNight: {
            icon: '&#10038;',
            colour: '#262626',
        },
        otherNight: {
            icon: '&#10038;',
            colour: '#262626',
        },
        reminder: {
            icon: '&#10038;',
            colour: '#262626',
        },
    },
};
