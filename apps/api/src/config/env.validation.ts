import Joi from 'joi';

export type NodeEnv = 'development' | 'production' | 'test';

interface JwtEnvVars {
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  NODE_ENV?: NodeEnv;
}

export const envValidationSchema = Joi.object<JwtEnvVars>({
  DATABASE_URL: Joi.string().uri().required(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
});
