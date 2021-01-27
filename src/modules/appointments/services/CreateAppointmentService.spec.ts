import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeNotificationRepository from '@modules/notification/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 10, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2021, 0, 10, 13),
      provider_id: '3322',
      user_id: '123',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('3322');
  });
  it('should not create 2 appointments on the same time', async () => {
    const AppointmentDate = new Date(2021, 5, 10, 11);

    await createAppointment.execute({
      date: AppointmentDate,
      provider_id: '3322',
      user_id: '123',
    });

    await expect(
      createAppointment.execute({
        date: AppointmentDate,
        provider_id: '3322',
        user_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 10, 11),
        provider_id: '3322',
        user_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not create an appointment with the same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 10, 13),
        provider_id: 'sameID',
        user_id: 'sameID',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not create an appointment before 8am and after 5pm ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 11, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 11, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
