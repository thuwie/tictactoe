import { Module, Global } from '@nestjs/common';

import { RoomsService, SocketService } from './services';

const providers = [
  RoomsService,
  SocketService,
];

@Global()
@Module({
  providers,
  imports: [...providers],
  exports: [...providers],
})
export class SharedModule {}
