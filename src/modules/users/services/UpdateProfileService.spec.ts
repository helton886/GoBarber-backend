import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it(`should be able to update user's profile.`, async () => {
    const user = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Helton Vasconcelos',
      email: 'helton@hotmail.com',
    });

    expect(updatedUser.name).toBe('Helton Vasconcelos');
    expect(updatedUser.email).toBe('helton@hotmail.com');
  });
  it(`should not be able to change to an used email`, async () => {
    await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton1@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Helton Vasconcelos',
        email: 'helton@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it(`should be able to update the password`, async () => {
    const user = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Helton Alves',
      email: 'helton1@gmail.com',
      password: '123123',
      oldPassword: '123456',
    });

    await expect(updatedUser.password).toBe('123123');
  });
  it(`should not be able to update the password without old password`, async () => {
    const user = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Helton Alves',
        email: 'helton1@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it(`should not be able to update the password with wrong old password`, async () => {
    const user = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Helton Alves',
        email: 'helton1@gmail.com',
        password: '123123',
        oldPassword: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it(`should not be able to update an non existing user`, async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user',
        name: 'Helton Alves',
        email: 'helton1@gmail.com',
        password: '123123',
        oldPassword: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
