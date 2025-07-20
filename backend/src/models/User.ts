export class User {
  id: number | string;
  name: string;
  email: string;

  constructor(id: number | string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
