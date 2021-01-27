import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;

let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to authenticated', async () => {
    const user = await createUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    const response = await authenticateUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticated with wrong email', async () => {
    await createUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    await expect(
      authenticateUserService.execute({
        email: 'helton1@gmail.com',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticated with wrong password', async () => {
    await createUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    await expect(
      authenticateUserService.execute({
        email: 'helton@gmail.com',
        password: '1234123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticated with non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'helton@gmail.com',
        password: '1234123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
