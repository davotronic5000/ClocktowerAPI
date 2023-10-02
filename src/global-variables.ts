import { TokenProcessingVariables } from './types';

export const defaultTokenSize: TokenProcessingVariables = {
    page: {
        height: 1123,
        width: 794,
        margin: 38,
    },
    tokens: {
        margin: 4,
        role: {
            size: 170,
            imageMarginX: 20,
            imageMarginY: 10,
        },
        reminder: {
            size: 94.5,
            imageMarginX: 15,
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
            squareBorder: false,
            thickness: 5,
        },
    },
};
