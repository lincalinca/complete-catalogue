import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: { nextConfigPath: '../next.config.ts' },
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    // Add path aliases for crescender-core imports
    const corePath = path.resolve(__dirname, '../../crescender-core');
    
    // Ensure config and resolve are properly initialized
    if (!config) {
      config = {};
    }
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../'),
      '@/components': path.resolve(corePath, 'components'),
      '@/lib': path.resolve(corePath, 'lib'),
    };
    
    return config;
  },
};

export default config;
