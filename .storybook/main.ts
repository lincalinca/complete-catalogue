import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: false,
  },
  webpackFinal: async (config) => {
    // Add path aliases for crescender-core imports
    if (config.resolve) {
      const corePath = path.resolve(__dirname, '../../crescender-core');
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
        '@/components': path.resolve(corePath, 'components'),
        '@/lib': path.resolve(corePath, 'lib'),
      };
    }

    // Ensure JSX files are processed by babel-loader
    if (config.module?.rules) {
      // Find and update the JS/JSX rule
      const jsRuleIndex = config.module.rules.findIndex(
        (rule: any) => rule.test && rule.test.toString().includes('jsx?')
      );
      
      if (jsRuleIndex >= 0) {
        const jsRule = config.module.rules[jsRuleIndex];
        // Ensure it includes .jsx files
        if (jsRule.test && !jsRule.test.toString().includes('jsx')) {
          jsRule.test = /\.(mjs|jsx?|tsx?)$/;
        }
      }
    }

    return config;
  },
};

export default config;
