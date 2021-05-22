export class User {
  name: string;
  serviceAccount: boolean;
  constructor(user: User) {
    Object.assign(this, user);
  }

  static getDevbanServiceAccount(): User {
    return new User({
      name: 'devban',
      serviceAccount: true
    });
  }
}
