export class UserForgotPasswordEvent {
  constructor(
    public email: string,
    public fullName: string,
    public otpCode: number,
  ) {}
}
