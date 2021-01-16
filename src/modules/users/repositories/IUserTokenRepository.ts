import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUsersRepository {
  generate(id: string): Promise<UserToken>;
}
