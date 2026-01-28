import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { printSchema } from 'graphql';
import { AppModule } from '@app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const gqlSchemaHost = app.get(GraphQLSchemaHost);
  const schema = gqlSchemaHost.schema;
  if (!schema) throw new Error('Schema not generated!');

  // Absolute path for packages/graphql-schema/schema.gql in root of monorepo
  const outFile = resolve(
    __dirname,
    '../../../packages/graphql-schema/schema.gql',
  );
  writeFileSync(outFile, printSchema(schema));

  console.log('Schema generated to', outFile);
  await app.close();
}

void bootstrap();
