import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('Show Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });
  it(`should be able to show user's profile.`, async () => {
    const user = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });
    const userProfile = await showProfileService.execute({ user_id: user.id });

    expect(userProfile.name).toBe('Helton Alves');
    expect(userProfile.email).toBe('helton@gmail.com');
  });
  it(`should be not able to show the profile from non existing user.`, async () => {
    await expect(
      showProfileService.execute({ user_id: 'non existing id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
