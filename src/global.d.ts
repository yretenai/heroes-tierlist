/// <reference types="svelte" />

interface Point {
    x: number,
    y: number
}

enum Role {
    Tank = 0,
    Bruiser = 1,
    Ranged = 2,
    Melee = 3,
    Healer = 4,
    Support = 5
}

interface HeroData {
    name: string,
    title: string,
    search: string,
    circleIcon: string,
    cardPortrait: string,
    cardFlip: boolean,
    cardOffset: Point,
    masked: boolean?,
    id: number,
    tier: number?,
    role: Role
};

interface MoveHeroEvent {
    tierListId: number,
    heroId: number
}

interface Tier {
    label: string,
    color: string,
    id: number,
    altTier: number?
}
