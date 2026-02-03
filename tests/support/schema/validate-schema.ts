import Ajv, { ValidateFunction, JSONSchemaType, ErrorObject } from 'ajv';
import { expect } from '@playwright/test';

const ajv = new Ajv({ allErrors: true, strict: false });

export function validateSchema<T>(data: T, schema: JSONSchemaType<T> | object) {
  const validate: ValidateFunction = ajv.compile(schema);

  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors || [];
    const errorMessages = errors.map((err: ErrorObject) => {
      return `Path: ${err.instancePath || '(root)'}, Error: ${err.message}`;
    }).join('\n');

    expect(valid, `Schema validation failed:\n${errorMessages}`).toBe(true);
  }
   expect(valid, 'Schema validation passed').toBe(true);
}
