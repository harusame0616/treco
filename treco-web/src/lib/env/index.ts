import {
  ObjectEntries,
  boolean,
  coerce,
  object,
  picklist,
  safeParse,
  string,
} from 'valibot';

const EnvSchema = object({
  CI: coerce(boolean(), (v) => v === 'true'),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
  LOG_LEVEL: picklist(['debug', 'info', 'warn', 'error', 'fatal']),
  NEXT_AUTH_JWT_NO_ENCRYPTION: coerce(boolean(), (v) => v === 'true'),
  NEXT_AUTH_SECRET: string(),
  NODE_ENV: picklist(['development', 'production', 'test']),
});

type EnvKey = keyof (typeof EnvSchema)['entries'];

const maskKeys = [
  'GOOGLE_CLIENT_SECRET',
  'NEXT_AUTH_SECRET',
] as const satisfies readonly EnvKey[];

type MaskKey = (typeof maskKeys)[number];

type EnvSchemaErrorIssue = {
  [key in EnvKey]?: unknown;
};

export class EnvSchemaError extends Error {
  constructor(
    message: string,
    public readonly issue: EnvSchemaErrorIssue,
  ) {
    super(message);
  }

  static {
    this.prototype.name = EnvSchemaError.name;
  }
}

process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

const parsedEnv = safeParse(EnvSchema, process.env);

if (!parsedEnv.success) {
  const issue: EnvSchemaErrorIssue = Object.fromEntries(
    parsedEnv.issues.map((issue) => [
      issue.path?.[0].key,
      maskKeys.includes(issue.path?.[0].key as MaskKey) ? '***' : issue.input,
    ]),
  );

  const error = new EnvSchemaError(`環境変数が不正です`, issue);

  console.error({
    error: error,
    message: `環境変数が不正です：${Object.keys(issue).join(', ')} `,
  });

  throw error;
}

export const { output: env } = parsedEnv;
