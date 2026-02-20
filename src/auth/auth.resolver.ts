import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './dto/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }
}
