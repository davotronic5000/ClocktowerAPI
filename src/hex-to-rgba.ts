const hexToRGBA = (hex: string, alpha?: number) => {
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((hex) => {
                return hex + hex;
            })
            .join('');
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return `rgb(${r}, ${g}, ${b})`;
};

export default hexToRGBA;
