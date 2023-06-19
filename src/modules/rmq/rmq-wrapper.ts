import * as amqp from 'amqplib';
import { createLogger } from '../../components/logger';
import { Options } from 'amqplib';

const logger = createLogger(module);

export class RmqWrapper {
  private channel: amqp.ConfirmChannel = null;
  private channelCreationPromise: Promise<void> = null;

  constructor(private readonly connectionString: string) {}

  private async ensureChannelCreated() {
    if (this.channel) {
      return Promise.resolve();
    }

    logger.info('No RMQ channel');

    if (!this.channelCreationPromise) {
      logger.info('Trying to create channel');

      this.channelCreationPromise = Promise.resolve()
        .then(async () => {
          const connection = await amqp.connect(this.connectionString);

          if (!connection) {
            logger.error('Failed to create connection');

            throw new Error('Connection not created');
          }

          connection.on('close', () => {
            logger.info(`RMQ connection close`);

            this.channel = null;
          });

          connection.on('error', (err) => {
            logger.error(`RMQ connection error ["${JSON.stringify(err)}"]`);

            this.channel = null;
          });

          const channel = await connection.createConfirmChannel();

          channel.on('close', () => {
            logger.info(`RMQ channel closed`);

            this.channel = null;
          });

          channel.on('error', (err) => {
            logger.error(`RMQ channel error ["${JSON.stringify(err)}"]`);

            this.channel = null;
          });

          return channel;
        })
        .then((channel) => {
          logger.info(`Channel created`);

          this.channel = channel;
          this.channelCreationPromise = null;
        })
        .catch((error) => {
          logger.error(
            `SERVICE_ALERT::Failed to establish connection to broker - ${error.message}`,
          );

          this.channel = null;
          this.channelCreationPromise = null;

          throw error;
        });
    } else {
      logger.info('Channel creation is in progess now');
    }

    return this.channelCreationPromise;
  }

  async publish(
    exchange: string,
    routingKey: string,
    content: Buffer,
    options: Options.Publish = {},
  ): Promise<void> {
    await this.ensureChannelCreated();

    return new Promise((resolve, reject) => {
      this.channel.publish(exchange, routingKey, content, options, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
}
