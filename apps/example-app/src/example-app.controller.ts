import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExampleAppService } from './example-app.service';

/**
 * Example App Controller
 * Provides health check and application information endpoints
 */
@ApiTags('health')
@Controller()
export class ExampleAppController {
  constructor(private readonly exampleAppService: ExampleAppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application information' })
  @ApiResponse({
    status: 200,
    description: 'Application info with links to documentation',
  })
  getInfo() {
    return this.exampleAppService.getInfo();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
