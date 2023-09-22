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
            imageMarginY: 5,
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
            colour: ' #d97f3f',
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
        border: {
            colour: '#402f03',
            alpha: 0.4,
            circleBorder: true,
            squareBorder: true,
            thickness: 5,
        },
    },
};
