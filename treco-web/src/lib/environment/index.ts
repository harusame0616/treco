export function getRequiredEnv(environmentKey: string) {
  const value = process.env[environmentKey];

  if (!value) {
    const err = new Error(`Missing ${environmentKey} environment variable`);
    console.error({
      err,
      msg: err.message,
    });
    throw err;
  }

  return value;
}
