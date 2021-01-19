import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('helton@gmail.com');
  });
  it('should not be able to create a new user with the same email', async () => {
    await createUser.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    await expect(
      createUser.execute({
        email: 'helton@gmail.com',
        password: '12341234',
        name: 'Helton Alves',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
