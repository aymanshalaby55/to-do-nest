import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private signJwt(user: User): { access_token: string } {
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private getUserCacheKey(id: number): string {
    return `user:${id}`;
  }

  async signup(data: SignupDto): Promise<{ access_token: string }> {
    const { email } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    // Cache the new user's data
    const userData = { id: user.id, email: user.email, name: user.name };
    await this.cacheManager.set(
      this.getUserCacheKey(user.id),
      userData,
      60 * 60, // Cache for 1 hour
    );

    return this.signJwt(user);
  }

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update cache after successful login
    const userData = { id: user.id, email: user.email, name: user.name };
    await this.cacheManager.set(
      this.getUserCacheKey(user.id),
      userData,
      60 * 60, // Cache for 1 hour
    );

    return this.signJwt(user);
  }

  async getUser(id: number): Promise<Omit<User, 'password'>> {
    // Try to get user from Redis cache first
    const cachedUser = await this.cacheManager.get(this.getUserCacheKey(id));
    console.log('cachedUser:', cachedUser);

    if (cachedUser) {
      return cachedUser as Omit<User, 'password'>;
    }

    // If not in Redis cache, get from database
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    });

    if (!user) throw new NotFoundException('User not found');

    // Transform user to omit password before caching and returning
    const userWithoutPassword: Omit<User, 'password'> = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // Store in Redis cache for future requests
    await this.cacheManager.set(
      this.getUserCacheKey(id),
      userWithoutPassword,
      60 * 600000, // Cache for 1 hour
    );

    return userWithoutPassword;
  }
  // Method to invalidate user cache (useful for updates)
  async invalidateUserCache(id: number): Promise<void> {
    await this.cacheManager.del(this.getUserCacheKey(id));
  }
}
