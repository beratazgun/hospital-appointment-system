export class UserResetPasswordEvent {
  constructor(
    public email: string,
    public fullName: string,
    public updatedAt: Date,
  ) {}
}
