import { Controller, Get, Param, Redirect, Res } from '@nestjs/common';
import { RoomsService } from './shared/services';
import { join } from "path";

@Controller()
export class AppController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('createRoom')
  createRoom(): string {
    const id = this.roomsService.create();
    return `game.html?id=${id}`;
  }
}
