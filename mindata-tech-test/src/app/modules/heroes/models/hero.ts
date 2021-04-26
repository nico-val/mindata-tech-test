import { Superpower } from '../../superpowers/models/superpower';

export class Hero {
  id: string;
  name: string;
  birthday: Date;
  superpowers: Superpower[];

  public constructor(init?: Partial<Hero> | any) {
    Object.assign(this, init);
  }
}
