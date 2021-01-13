import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('helton@gmail.com');
  });
  it('should not be able to create a new user with the same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    expect(
      createUser.execute({
        email: 'helton@gmail.com',
        password: '12341234',
        name: 'Helton Alves',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
