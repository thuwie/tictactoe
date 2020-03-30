import { RoomStatus } from '../../../common/roomStatus';

export class Room {
  private readonly roomId: string;
  private roomStatus: RoomStatus;

  constructor(id: string) {
    this.roomId = id;
    this.roomStatus = RoomStatus.CREATED;
  }

  start(): void {

  }

  kill(): void {

  }

  get id(): string {
    return this.roomId;
  }

  get status(): RoomStatus {
    return this.roomStatus;
  }

  set status(value) {
    this.roomStatus = value;
  }
}