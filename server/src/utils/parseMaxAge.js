import ms from "ms";

const parseMaxAge = (value, fallback) => {
    if (!value) return fallback;

    const parsed = ms(value);

    if (typeof parsed !== "number") {
        throw new Error(`Invalid cookie age time format: ${value}`);
    };

    return parsed;
};

export default parseMaxAge;