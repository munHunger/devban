export class User {
  name: string;
  email: string;
  serviceAccount: boolean;
  constructor(user: User) {
    Object.assign(this, user);
  }

  static fromLocals(user: any): User {
    return new User({
      name: user.username,
      email: user.email,
      serviceAccount: false
    });
  }

  static getDevbanServiceAccount(): User {
    return new User({
      name: 'devban',
      email: '',
      serviceAccount: true
    });
  }
}
