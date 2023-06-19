import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import {
  RabbitMQTopologyConfig,
  TopologyAssertService,
} from './topologyAssertService';
import { createLogger } from '../../components/logger';
import { RmqWrapper } from './rmq-wrapper';

const logger = createLogger(module);

@Injectable()
export class RmqService implements OnApplicationBootstrap {
  public betBotRmqWrapper: RmqWrapper;

  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap() {
    return Promise.all([this.setUpBbRabbitInstance()]);
  }

  private async setUpBbRabbitInstance() {
    const betBotConnectionUrl =
      this.configService.get<string>('rmq.betBot.url');
    const betBotAssertTopology = this.configService.get<boolean>(
      'rmq.betBot.assertTopology',
    );

    if (betBotAssertTopology) {
      const betBotTopology = this.configService.get<any>('rmq.betBot.url');

      await new TopologyAssertService(
        betBotTopology as RabbitMQTopologyConfig,
        betBotConnectionUrl,
      )
        .assertTopology()
        .catch((err) => {
          logger.error(`Failed to assert topology: ${err}`);

          throw new Error(`Failed to assert monitoring topology: ${err}`);
        });
    }

    this.betBotRmqWrapper = new RmqWrapper(betBotConnectionUrl);
  }
}
