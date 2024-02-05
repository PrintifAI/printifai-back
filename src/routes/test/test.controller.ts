import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller()
export class TestController {
    constructor(private readonly appService: TestService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
