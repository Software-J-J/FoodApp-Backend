import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { DeliveryMethod, PrismaClient, UserRoles } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthDB');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Auth Connect Database');
  }

  async signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return {
        user: user,
        token: await this.signJwt(user), //aca firmo mi nuevo token
      };
    } catch (error) {
      console.log(error);

      throw new NotFoundException({
        status: 401,
        message: 'Invalid Token.',
      });
    }
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const {
      email,
      name,
      password,
      phone,
      address,
      roles,
      businessId,
      deliveryMethod,
    } = registerUserDto;

    try {
      const user = await this.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        throw new NotFoundException({
          status: HttpStatus.BAD_REQUEST,
          message: 'User already exists.',
        });
      }

      const newUser = await this.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, 10),
          name: name,
          phone: phone,
          address: address,
          roles: roles || [UserRoles.USER],
          deliveryMethod: deliveryMethod,
          businessId: businessId,
        },
      });

      const { password: _, ...rest } = newUser;
      return {
        user: rest,
        token: await this.signJwt(rest),
      };
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new NotFoundException({
          status: HttpStatus.BAD_REQUEST,
          message: 'User/Password invalid credencials.',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new NotFoundException({
          status: HttpStatus.BAD_REQUEST,
          message: 'User password not validt.',
        });
      }
      const { password: _, ...rest } = user;

      return {
        user: rest,
        token: await this.signJwt(rest),
      };
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findAll() {
    return await this.user.findMany();
  }
}
