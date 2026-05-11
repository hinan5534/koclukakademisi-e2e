export type Environment = 'production' | 'staging' | 'local';

interface EnvironmentConfig {
  baseUrl: string;
  name: string;
}

const environments: Record<Environment, EnvironmentConfig> = {
  production: {
    baseUrl: 'https://koclukakademisi.com',
    name: 'Production',
  },
  staging: {
    // Assumption: Staging URL mevcut değil, production ile aynı
    // Gerçek staging URL gelince güncellenmeli
    baseUrl: 'https://staging.koclukakademisi.com',
    name: 'Staging',
  },
  local: {
    baseUrl: 'http://localhost:3000',
    name: 'Local',
  },
};

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = (process.env.TEST_ENV as Environment) || 'production';
  return environments[env] ?? environments.production;
}

export const currentEnv = getEnvironmentConfig();
