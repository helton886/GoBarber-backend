import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '3322',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('3322');
  });
  it('should not create 2 appointments on the same time', async () => {
    const AppointmentDate = new Date();

    await createAppointment.execute({
      date: AppointmentDate,
      provider_id: '3322',
    });

    await expect(
      createAppointment.execute({
        date: AppointmentDate,
        provider_id: '3322',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
