import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });
  it('should be able to recover the password sending the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'helton@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password from a non existing user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await expect(
      sendForgotPasswordEmail.execute({
        email: 'helton@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMail).not.toBeCalled();
  });

  it('should be able to recover the password sending the email', async () => {
    const generate = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Helton Alves',
      email: 'helton@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'helton@gmail.com',
    });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
