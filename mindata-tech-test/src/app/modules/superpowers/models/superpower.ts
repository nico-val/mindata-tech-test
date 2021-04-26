export class Superpower {
  id: string;
  name: string;

  public constructor(init?: Partial<Superpower> | any) {
    Object.assign(this, init);
  }
}
