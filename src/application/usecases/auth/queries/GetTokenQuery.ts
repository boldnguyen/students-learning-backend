import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/domain/interfaces/user.interface';

export class GetTokenQuery {
  constructor(
    public readonly userName: string,
    public readonly password: string,
  ) {}
}

@QueryHandler(GetTokenQuery)
export class GetTokenQueryHandler implements IQueryHandler<GetTokenQuery> {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async execute(query: GetTokenQuery): Promise<any> {
    console.log(query);
    const user = await this.userModel
      .findOne({
        userName: query.userName,
        password: query.password,
      })
      .exec();

    const payload = { sub: user._id, username: user.userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
