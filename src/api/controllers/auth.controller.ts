import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody } from '@nestjs/swagger';
import { GetTokenQuery } from 'src/application/usecases/auth/queries/GetTokenQuery';
import { LoginDto } from '../dtos/auth/LoginDto';
import { Public } from '../guards/public.guard';
import { RegisterDto } from '../dtos/auth/RegisterDto';
import { RegisterUserCommand } from 'src/application/usecases/auth/commands/RegisterUserCommand';

@Controller('auth')
export class AuthController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.queryBus.execute(
      new GetTokenQuery(loginDto.userName, loginDto.password),
    );
    return result;
  }

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.commandBus.execute(
      new RegisterUserCommand(
        registerDto.userName,
        registerDto.password,
        registerDto.firstName,
        registerDto.lastName,
        registerDto.phone,
        registerDto.email,
      ),
    );
    return result;
  }
}
