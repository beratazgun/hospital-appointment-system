const MONGO_SCHEMA_METADATA_KEY = 'mongoSchema';

export class RegisterMongoSchema {
  private static instance: RegisterMongoSchema;

  protected constructor() {}

  public static getInstance() {
    if (!RegisterMongoSchema.instance) {
      RegisterMongoSchema.instance = new RegisterMongoSchema();
    }

    return RegisterMongoSchema.instance;
  }

  public invoke(connectionName: string, schemaFilePath: string) {}
}

export const registerMongoSchemaInstance = RegisterMongoSchema.getInstance();
