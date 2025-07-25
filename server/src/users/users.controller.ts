import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin', 'viewer')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles('admin')
  async createUser(
    @Body() body: { username: string; password: string; role?: 'admin' | 'viewer' },
  ) {
    return this.usersService.createUser(body);
  }
}
