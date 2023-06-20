import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as moment from 'moment';
import * as TelegramBot from 'node-telegram-bot-api';

export type SignalDocument = HydratedDocument<Signal>;

@Schema({
  timestamps: {
    currentTime: () => moment().utc().toDate(),
  },
})
export class Signal {
  @Prop()
  uuid: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  tgMessage: TelegramBot.Message;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
