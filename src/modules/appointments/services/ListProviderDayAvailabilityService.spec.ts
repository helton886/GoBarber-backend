import 'reflect-metadata';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it(`should be able to list month availability from provider`, async () => {
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '1',
      date: new Date(2020, 3, 13, 14, 0, 0),
    });
    await fakeAppointmentRepository.create({
      provider_id: '1',
      user_id: '1',
      date: new Date(2020, 3, 13, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 13, 11).getTime();
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: '1',
      year: 2020,
      month: 4,
      day: 13,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
