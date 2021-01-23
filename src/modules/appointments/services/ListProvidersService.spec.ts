import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let listProviders: ListProvidersService;
let fakeUsersRepository: FakeUsersRepository;

describe('List Providers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it(`should be able to list the providers`, async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton2@gmail.com',
      password: '123456',
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton3@gmail.com',
      password: '123456',
    });
    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
