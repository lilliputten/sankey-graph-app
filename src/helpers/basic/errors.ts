export function getErrorText(err?: Error | string): string {
  return err ? (err instanceof Error ? err.message : err) : '';
}

export function derivedErrorMessage(text: Error | string, parentError?: Error | string): string {
  return [getErrorText(text), getErrorText(parentError)].filter(Boolean).join(': ');
}
// TODO: Errors composer?
