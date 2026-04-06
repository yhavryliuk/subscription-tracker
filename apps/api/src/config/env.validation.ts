import Joi from 'joi';

export type NodeEnv = 'development' | 'production' | 'test';

interface JwtEnvVars {
  DATABASE_URL: string;
  REDIS_URL?: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  PORT?: number;
  NODE_ENV?: NodeEnv;
  // Rate limiting configuration
  RATE_LIMIT_SHORT_TTL?: number;
  RATE_LIMIT_SHORT_LIMIT?: number;
  RATE_LIMIT_LONG_TTL?: number;
  RATE_LIMIT_LONG_LIMIT?: number;
  RATE_LIMIT_AUTH_TTL?: number;
  RATE_LIMIT_AUTH_LIMIT?: number;
}

export const envValidationSchema = Joi.object<JwtEnvVars>({
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().optional(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  PORT: Joi.number().port().optional().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),

  // Rate limiting configuration
  RATE_LIMIT_SHORT_TTL: Joi.number().positive().optional().default(1000),
  RATE_LIMIT_SHORT_LIMIT: Joi.number().positive().optional().default(20),
  RATE_LIMIT_LONG_TTL: Joi.number().positive().optional().default(60000),
  RATE_LIMIT_LONG_LIMIT: Joi.number().positive().optional().default(300),
  RATE_LIMIT_AUTH_TTL: Joi.number().positive().optional().default(60000),
  RATE_LIMIT_AUTH_LIMIT: Joi.number().positive().optional().default(5),
});
