export const generateCodename = () => {
    const adjectives = ['The Silent', 'The Swift', 'The Nightingale', 'The Kraken', 'The Phantom'];
    const nouns = ['Viper', 'Tornado', 'Thunder', 'Lion', 'Shadow'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
};

export const generateSuccessProbability = () => {
    return Math.floor(Math.random() * 100) + '%';
};
