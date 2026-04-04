import Joi from 'joi';

export type NodeEnv = 'development' | 'production' | 'test';

interface JwtEnvVars {
  DATABASE_URL: string;
  REDIS_URL?: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  PORT?: number;
  NODE_ENV?: NodeEnv;
}

export const envValidationSchema = Joi.object<JwtEnvVars>({
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().optional(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  PORT: Joi.number().port().optional().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
});
