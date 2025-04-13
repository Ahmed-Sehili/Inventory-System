import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/auth.dto';

/**
 * Controller for authentication operations
 * Provides endpoints for user login and token management
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticate an admin user and receive a JWT token
   * @param loginData Login credentials (username and password)
   * @returns JWT token and username
   */
  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Authenticate admin user',
    description: `Authenticate with admin credentials and receive a JWT token.
    
This endpoint is public and does not require authentication.
The JWT token returned should be used in the Authorization header for all other API requests.

Format: Authorization: Bearer {token}`
  })
  @ApiBody({
    type: LoginDto,
    description: 'Admin credentials',
    examples: {
      adminUser: {
        summary: 'Admin user login',
        description: 'Login with admin credentials',
        value: {
          username: 'admin1',
          password: 'your_secure_password_1'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcxMzA5MjM5NywiZXhwIjoxNzEzMDk1OTk3fQ.example-token',
        username: 'admin1'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials - Username or password is incorrect',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error'
      }
    }
  })
  async login(@Body() loginData: LoginDto) {
    try {
      return this.authService.login(loginData.username, loginData.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
