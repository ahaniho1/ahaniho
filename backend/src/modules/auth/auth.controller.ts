import { Controller, Get, Post, Put, Body, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../../schemas/user.schema';
import { Role, RoleDocument } from '../../schemas/role.schema';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: body.email }).populate('roleId');
    if (!user || !user.isActive) return { error: 'Invalid credentials' };
    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return { error: 'Invalid credentials' };
    const token = jwt.sign(
      { sub: user._id, email: user.email, role: (user.roleId as any)?.slug },
      process.env.JWT_ACCESS_SECRET || 'ahan-iho-access-secret-key-2026',
      { expiresIn: '7d' },
    );
    await this.userModel.updateOne({ _id: user._id }, { lastLogin: new Date() });
    return {
      token,
      user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl, role: (user.roleId as any)?.slug },
    };
  }

  @Get('me')
  async me(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return { error: 'No token' };
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'ahan-iho-access-secret-key-2026');
      const user = await this.userModel.findById(decoded.sub).populate('roleId');
      if (!user) return { error: 'User not found' };
      return { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl, role: (user.roleId as any)?.slug };
    } catch { return { error: 'Invalid token' }; }
  }

  @Put('change-password')
  async changePassword(@Body() body: { currentPassword: string; newPassword: string }, @Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return { error: 'No token' };
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'ahan-iho-access-secret-key-2026');
      const user = await this.userModel.findById(decoded.sub);
      if (!user) return { error: 'User not found' };
      const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
      if (!valid) return { error: 'Current password is incorrect' };
      user.passwordHash = await bcrypt.hash(body.newPassword, 10);
      await user.save();
      return { message: 'Password updated successfully' };
    } catch { return { error: 'Invalid token' }; }
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    const existing = await this.userModel.findOne({ email: body.email });
    if (existing) return { error: 'Email already registered' };

    const publicRole = await this.roleModel.findOne({ slug: 'public_user' });
    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await this.userModel.create({
      email: body.email,
      passwordHash,
      firstName: body.name,
      lastName: '',
      roleId: publicRole?._id ? publicRole._id.toString() : undefined,
      isActive: true,
    } as any);

    const token = jwt.sign(
      { sub: user._id, email: user.email, role: 'public_user' },
      process.env.JWT_ACCESS_SECRET || 'ahan-iho-access-secret-key-2026',
      { expiresIn: '7d' },
    );

    return {
      token,
      user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: '', role: 'public_user' },
    };
  }
}