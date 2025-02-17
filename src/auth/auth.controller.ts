import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles, Token, User } from './decorators';
import { CurrentUser } from './interface';
import { RolesUserList } from './enum/roles-enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return this.authService.verifyToken(token);
  }

  @UseGuards(AuthGuard)
  @Roles(RolesUserList.DESARROLLADOR, RolesUserList.ADMINISTRADOR)
  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Roles(RolesUserList.DESARROLLADOR, RolesUserList.ADMINISTRADOR)
  @Get(':id')
  findAll(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findAll(id);
  }
}
