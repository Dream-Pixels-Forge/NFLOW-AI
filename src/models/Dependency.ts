export interface Dependency {
  name: string;
  version: string;
  status: 'installed' | 'missing' | 'outdated' | 'incompatible';
  required: boolean;
  description: string;
}