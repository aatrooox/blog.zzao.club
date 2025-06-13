import type { z } from 'zod'

type ZodType = z.ZodTypeAny
type ZodOptionalType = z.ZodOptional<ZodType>
type ZodDefaultType = z.ZodDefault<ZodType>
// type ZodEnumType = z.ZodEnum<[string, ...string[]]>

function isOptional(schema: ZodType): schema is ZodOptionalType {
  return schema._def.typeName === 'ZodOptional'
}

function hasDefault(schema: ZodType): schema is ZodDefaultType {
  return schema._def.typeName === 'ZodDefault'
}

function isOpenApiSchema(type: string): any {
  switch (type) {
    case 'string':
      return { type: 'string' }
    case 'number':
      return { type: 'number' }
    case 'integer':
      return { type: 'integer' }
    case 'boolean':
      return { type: 'boolean' }
    default:
      return { type: 'string' } // fallback
  }
}

function getZodBaseType(schema: ZodType): string {
  const typeName = schema._def.typeName

  if (typeName === 'ZodString')
    return 'string'
  if (typeName === 'ZodNumber')
    return 'number'
  if (typeName === 'ZodInt')
    return 'integer'
  if (typeName === 'ZodBoolean')
    return 'boolean'
  if (typeName === 'ZodEnum')
    return 'string' // enum 基础还是字符串
  if (typeName === 'ZodArray')
    return 'array'

  return 'string'
}

interface GenerateOptions {
  type: 'parameters' | 'requestBody'
  inWhere?: 'query' | 'path' | 'header' | 'cookie'
  required?: boolean
}

export function generateOpenApiFromZod(
  schema: z.ZodObject<any>,
  options: GenerateOptions,
): any {
  const { type, inWhere = 'query' } = options

  if (type === 'parameters') {
    const entries = Object.entries(schema.shape)

    return entries.map(([name, field]) => {
      let currentField = field as any
      let isRequired = true
      let defaultValue: any
      let enumValues: string[] | undefined

      if (isOptional(currentField)) {
        isRequired = false
        currentField = currentField._def.innerType
      }

      if (hasDefault(currentField)) {
        defaultValue = currentField._def.defaultValue()
        isRequired = false
        currentField = currentField._def.innerType
      }

      if (currentField._def.typeName === 'ZodEnum') {
        enumValues = currentField._def.values
      }

      const fieldType = getZodBaseType(currentField)

      const parameter: any = {
        in: inWhere,
        name,
        required: isRequired,
        schema: {
          ...isOpenApiSchema(fieldType),
          ...(defaultValue !== undefined ? { default: defaultValue } : {}),
          ...(enumValues ? { enum: enumValues } : {}),
        },
      }

      return parameter
    })
  }

  if (type === 'requestBody') {
    const properties: Record<string, any> = {}
    const requiredFields: string[] = []

    const entries = Object.entries(schema.shape)
    for (const [name, field] of entries) {
      let currentField = field as any
      let isRequired = true
      let enumValues: string[] | undefined

      if (isOptional(currentField)) {
        isRequired = false
        currentField = currentField._def.innerType
      }

      if (hasDefault(currentField)) {
        isRequired = false
        currentField = currentField._def.innerType
      }

      if (currentField._def.typeName === 'ZodEnum') {
        enumValues = currentField._def.values
      }

      const fieldType = getZodBaseType(currentField)

      if (fieldType === 'array') {
        const elementSchema = (currentField as any)._def.type
        const elementType = getZodBaseType(elementSchema)

        properties[name] = {
          type: 'array',
          items: {
            ...isOpenApiSchema(elementType),
          },
          ...(enumValues ? { enum: enumValues } : {}),
        }
      }
      else {
        properties[name] = {
          ...isOpenApiSchema(fieldType),
          ...(enumValues ? { enum: enumValues } : {}),
        }
      }

      if (isRequired) {
        requiredFields.push(name)
      }
    }

    return {
      required: requiredFields.length > 0,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties,
            ...(requiredFields.length > 0 ? { required: requiredFields } : {}),
          },
        },
      },
    }
  }

  throw new Error('Unsupported OpenAPI spec type')
}
