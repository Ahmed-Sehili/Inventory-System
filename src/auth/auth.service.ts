import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggingService } from 'src/logging/logging.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private adminUsers: { username: string; password: string; isAdmin: boolean }[];

  constructor(
    private jwtService: JwtService,
    private logger: LoggingService,
    private configService: ConfigService
  ) {
    this.logger.setContext('AuthService');
    
    // Load admin users from environment variables
    this.adminUsers = [
      {
        username: this.configService.get<string>('ADMIN1_USERNAME') || 'admin1',
        password: this.configService.get<string>('ADMIN1_PASSWORD') || '',
        isAdmin: true
      },
      {
        username: this.configService.get<string>('ADMIN2_USERNAME') || 'admin2',
        password: this.configService.get<string>('ADMIN2_PASSWORD') || '',
        isAdmin: true
      }
    ];

    // Validate admin credentials are properly configured
    if (!this.adminUsers[0].password || !this.adminUsers[1].password) {
      this.logger.error('Admin credentials not properly configured in environment variables', '', 'AuthService');
    }
  }

  /**
   * Validates a user's credentials against the predefined admin users
   */
  validateUser(username: string, password: string) {
    this.logger.log(`Attempting to validate user: ${username}`, 'AuthService');
    
    const user = this.adminUsers.find(
      user => user.username === username && user.password === password
    );
    
    if (!user) {
      this.logger.warn(`Authentication failed for user: ${username}`, 'AuthService');
      throw new UnauthorizedException('Invalid credentials');
    }
    
    this.logger.log(`User authenticated successfully: ${username}`, 'AuthService');
    return user;
  }

  /**
   * Authenticates a user and returns a JWT token if valid
   */
  login(username: string, password: string) {
    this.logger.log(`Login attempt for user: ${username}`, 'AuthService');
    
    try {
      const user = this.validateUser(username, password);
      
      const payload = { 
        username: user.username,
        isAdmin: user.isAdmin
      };
      
      const token = this.jwtService.sign(payload);
      this.logger.log(`JWT token generated for user: ${username}`, 'AuthService');
      
      return {
        access_token: token,
        username: user.username
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack, 'AuthService');
      throw error;
    }
  }
}
