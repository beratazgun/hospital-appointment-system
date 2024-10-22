export class VerifyEmailCommand {
  constructor(
    public readonly otpCode: number,
    public readonly email: string,
  ) {}
}
