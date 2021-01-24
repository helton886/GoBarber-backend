import 'reflect-metadata';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it(`should be able to list month availability from provider`, async () => {
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 8, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 2, 13, 9, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 10, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 11, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 12, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 13, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 14, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 15, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 16, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 17, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 10, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 10, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 13, 10, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 14, 10, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 3, 15, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: '1',
      year: 2020,
      month: 4,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 13, available: false },
        { day: 14, available: true },
        { day: 15, available: true },
      ]),
    );
  });
});
