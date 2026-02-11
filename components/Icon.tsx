import React from 'react';
import { LucideProps } from 'lucide-react';
import { 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Download, 
  Sparkles, 
  Undo,
  Redo,
  Layout,
  Maximize,
  Moon,
  Sun,
  Camera,
  Search,
  Code,
  Upload
} from 'lucide-react';

export const Icons = {
  Type,
  Image: ImageIcon,
  Palette,
  Download,
  Sparkles,
  Undo,
  Redo,
  Layout,
  Maximize,
  Moon,
  Sun,
  Camera,
  Search,
  Code,
  Upload
};

interface IconProps extends LucideProps {
  name: keyof typeof Icons;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = Icons[name];
  return <LucideIcon {...props} />;
};