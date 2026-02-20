import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'password'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(signupInput: SignupInput) {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: signupInput.email }, { username: signupInput.username }],
    });

    if (existingUser) {
      throw new UnauthorizedException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(signupInput.password, 10);
    const user = this.usersRepository.create({
      ...signupInput,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...userWithoutPassword } = savedUser;

    const payload = { email: savedUser.email, sub: savedUser.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: userId },
    });
  }
}
