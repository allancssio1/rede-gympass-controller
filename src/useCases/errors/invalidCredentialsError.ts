export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invaled credentials.')
  }
}
