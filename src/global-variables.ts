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
};
