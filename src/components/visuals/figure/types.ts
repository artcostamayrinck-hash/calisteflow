/**
 * Definições de tipos para o motor de animação anatômica vetorial do CalisteFlow
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface SkeletonJoints {
  // Tronco e cabeça
  shoulder: Point2D;
  hip: Point2D;
  neck: Point2D;
  head: Point2D;

  // Membro superior próximo (em primeiro plano)
  elbow: Point2D;
  wrist: Point2D;
  hand: Point2D;

  // Membro inferior próximo (em primeiro plano)
  knee: Point2D;
  ankle: Point2D;
  toe: Point2D;

  // Membro superior oposto (atrás do tronco)
  backShoulder?: Point2D;
  backElbow?: Point2D;
  backWrist?: Point2D;
  backHand?: Point2D;

  // Membro inferior oposto (atrás do tronco)
  backHip?: Point2D;
  backKnee?: Point2D;
  backAnkle?: Point2D;
  backToe?: Point2D;
}

export interface PropConfig {
  type:
    | 'floor'
    | 'box'
    | 'pullupBar'
    | 'lowBar'
    | 'dipBars'
    | 'rings'
    | 'wall'
    | 'doorTowel'
    | 'abWheel'
    | 'band'
    | 'backpack';
  height?: number;
  width?: number;
  x?: number;
  y?: number;
  attachmentPoint?: Point2D;
  secondaryPoint?: Point2D;
}

export interface ShadowConfig {
  cx: number;
  cy?: number;
  rx?: number;
  ry?: number;
  opacity?: number;
}

export interface PoseState {
  joints: SkeletonJoints;
  view: 'side' | 'front';
  gazeAngle?: number; // radianos
  effort: number;     // 0 (repouso) a 1 (pico concêntrico/isometria máxima)
  shadow: ShadowConfig;
  prop?: PropConfig;
}

export type ExerciseTimingType =
  | 'smooth-loop'
  | 'isometric'
  | 'eccentric'
  | 'alternating';

export interface ExerciseAnimationDef {
  exerciseId: string;
  name: string;
  familyId: number;
  familyName: string;
  view: 'side' | 'front';
  timingType: ExerciseTimingType;
  durationSeconds: number;
  defaultProp?: PropConfig;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  generatePose: (timeNormalized: number) => PoseState;
}

// ==========================================
// ESTILOS DE FIGURA E PERSONALIZAÇÃO DE AVATAR
// ==========================================

export type FigureStyle =
  | 'mannequin'   // 1. Manequim neutro (cinza-azulado, articulações marcadas, sem rosto)
  | 'anatomical'  // 2. Anatômico simplificado (pele, bermuda/roupa, músculos destacados)
  | 'silhouette'  // 3. Silhueta sólida (uma cor de alto contraste para miniaturas e treino)
  | 'outline'     // 4. Contorno (traço ciano neon de 2px sobre fundo escuro)
  | 'xray';       // 5. Raio-X (ossos translúcidos e articulações para alinhamento)

export type AvatarGender = 'masculino' | 'feminino' | 'neutro';
export type AvatarBiotype = 'magro' | 'medio' | 'atletico' | 'maior';
export type AvatarSkinTone = 'claro' | 'moreno' | 'bronze' | 'escuro' | 'retinto';
export type AvatarHairStyle = 'curto' | 'longo' | 'preso' | 'careca';
export type AvatarClothing = 'bermuda' | 'regata' | 'camiseta';

export interface AvatarSettings {
  preferredStyle: FigureStyle;
  gender: AvatarGender;
  biotype: AvatarBiotype;
  skinTone: AvatarSkinTone;
  hairStyle: AvatarHairStyle;
  clothing: AvatarClothing;
  colorBlindMode: boolean; // Ativa laranja/azul e padrão de listras táteis
}

