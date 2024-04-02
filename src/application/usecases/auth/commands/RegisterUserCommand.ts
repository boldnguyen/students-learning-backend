import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { User } from 'src/domain/interfaces/user.interface';

export class RegisterUserCommand {
  constructor(
    public readonly userName: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly email: string,
  ) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  /**
   * Hàm đăng ký tài khoản
   * @param command model tạo tài khoản
   */
  async execute(command: RegisterUserCommand): Promise<any> {
    const result = await this.userModel.create(command);
    result.save();
  }
}
