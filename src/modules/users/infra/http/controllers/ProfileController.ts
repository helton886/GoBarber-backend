import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class UsersController {
  public async show(request: Request, response: Request): Promise<Response> {}

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, oldPassword, password } = request.body;
    const user_id = request.user.id;
    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      name,
      email,
      password,
      oldPassword,
      user_id,
    });
    delete user.password;
    return response.json(user);
  }
}
