export function getRequiredEnv(environmentKey: string) {
  const value = process.env[environmentKey];

  if (!value) {
    const err = new Error(`Missing ${environmentKey} environment variable`);
    console.error({
      msg: err.message,
      err,
    });
    throw err;
  }

  return value;
}
