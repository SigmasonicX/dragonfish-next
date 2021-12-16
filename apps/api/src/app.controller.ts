import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { account } from '@dragonfish/models';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
