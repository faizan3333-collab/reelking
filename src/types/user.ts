export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isPro: boolean;
  credits: number;
  lifetimeUsed: number;
  createdAt: Date;
  proExpiresAt?: Date;
}

export interface Generation {
  id?: string;
  uid: string;
  idea: string;
  platforms: string[];
  output: GenerationOutput;
  createdAt: Date;
}

export interface GenerationOutput {
  youtube?: {
    title: string;
    description: string;
    hashtags: string[];
  };
  instagram?: {
    caption: string;
    hashtags: string[];
  };
  facebook?: {
    caption: string;
    hashtags: string[];
  };
  whatsapp?: {
    message: string;
  };
}