// types.ts
export interface FloatingEmojiProps {
  emoji: string;
  style: string;
}

export interface GradientBlobProps {
  color: string;
  style: string;
}

export interface Card3DProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export interface FeatureCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  delay: number;
}

export interface ExampleThumbnail {
  title: string;
  emoji: string;
  tags: string[];
}

export interface Position {
  x: number;
  y: number;
}
