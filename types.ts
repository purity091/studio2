export interface DesignState {
  headline: string;
  subline: string;
  footerText: string;
  imageUrl: string;
  accentColor: string;
  secondaryColor: string;
  isGrayscale: boolean;
  showCircle: boolean;
  customCss: string;
  logoUrl: string | null;
}

export type AspectRatio = 'portrait' | 'square' | 'landscape';

export interface AIState {
  isLoading: boolean;
  error: string | null;
}