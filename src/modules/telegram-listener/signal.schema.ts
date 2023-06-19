import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as TelegramBot from 'node-telegram-bot-api';

export type SignalDocument = HydratedDocument<Signal>;

@Schema()
export class Signal {
  @Prop()
  uuid: string;

  @Prop()
  tgMessage: TelegramBot.Message;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
