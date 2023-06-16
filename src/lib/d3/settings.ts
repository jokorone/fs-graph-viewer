
export enum SimulationSettingsEnum {
  chargeForceStrength = 'chargeForceStrength',
  chargeDistanceMin = 'chargeDistanceMin',
  chargeDistanceMax = 'chargeDistanceMax',
  collideStrength = 'collideStrength',
  collideRadius = 'collideRadius',
  linkDistance = 'linkDistance',
  forceCenterX = 'forceCenterX',
  forceCenterY = 'forceCenterY',
  forceX = 'forceX',
  forceY = 'forceY',
};

export type SimulationSettings = typeof DefaultSimulationSettings;

export type GraphSettingInputConfig = {
  step: number;
  min: number;
  max: number;
}

export const humanReadable = (key: SimulationSettingsEnum) => HumanSimulationSettings[key];

const HumanSimulationSettings: {
  [key in SimulationSettingsEnum]: string
} = {
  [SimulationSettingsEnum.chargeForceStrength]: 'cozyness',
  [SimulationSettingsEnum.chargeDistanceMin]: 'charge distance min',
  [SimulationSettingsEnum.chargeDistanceMax]: 'charge distance max',
  [SimulationSettingsEnum.collideStrength]: 'collide strength',
  [SimulationSettingsEnum.collideRadius]: 'collide radius',
  [SimulationSettingsEnum.linkDistance]: 'link distance',
  [SimulationSettingsEnum.forceCenterX]: 'forceCenter (x)',
  [SimulationSettingsEnum.forceCenterY]: 'forceCenter (y)',
  [SimulationSettingsEnum.forceX]: 'position (x)',
  [SimulationSettingsEnum.forceY]: 'position (y)',
};

export const DefaultSimulationSettings: {
  [key in SimulationSettingsEnum]: number
} = {
  chargeForceStrength: -200,
  chargeDistanceMin: 1,
  chargeDistanceMax: 1312,
  collideRadius: 0,
  collideStrength: 0,
  linkDistance: 35,
  // forceCenterX: 0,// Math.floor(window.innerWidth * .1),
  // forceCenterY: 0,// Math.floor(window.innerHeight * .1),
  // forceX: 0,// Math.floor(window.innerWidth * .1),
  // forceY: 0,// Math.floor(window.innerHeight * .1),
  forceCenterX: Math.floor(window.innerWidth * .1),
  forceCenterY: Math.floor(window.innerHeight * .1),
  forceX: Math.floor(window.innerWidth * .1),
  forceY: Math.floor(window.innerHeight * .1),
}

export const SimulationSettingsInputs: {
  [key in SimulationSettingsEnum]: GraphSettingInputConfig
} = {
  [SimulationSettingsEnum.chargeForceStrength]: {
    step: 1,
    min: -200,
    max: 50,
  },
  [SimulationSettingsEnum.chargeDistanceMax]: {
    step: 1,
    min: 0,
    max: 1312,
  },
  [SimulationSettingsEnum.linkDistance]: {
    step: 1,
    min: 0,
    max: 100,
  },
  [SimulationSettingsEnum.chargeDistanceMin]: {
    step: .1,
    min: 0,
    max: 500,
  },
  [SimulationSettingsEnum.collideRadius]: {
    step: 1,
    min: 0,
    max: 100,
  },
  [SimulationSettingsEnum.collideStrength]: {
    step: .1,
    min: 0,
    max: 2,
  },
  [SimulationSettingsEnum.forceCenterX]: {
    step: 1,
    min: 0,
    max: window.innerWidth,
  },
  [SimulationSettingsEnum.forceCenterY]: {
    step: 1,
    min: 0,
    max: window.innerHeight,
  },
  [SimulationSettingsEnum.forceX]: {
    step: 1,
    min: 0,
    max: window.innerWidth,
  },
  [SimulationSettingsEnum.forceY]: {
    step: 1,
    min: 0,
    max: window.innerHeight,
  },
}
