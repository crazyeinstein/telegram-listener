import * as amqp from 'amqplib';

export interface RabbitMQTopologyConfig {
  exchanges: {
    [key: string]: {
      name: string;
      type: string;
      options: {
        [key: string]: any;
      };
    };
  };
  queues: {
    [key: string]: {
      name: string;
      options: {
        [key: string]: any;
      };
    };
  };
  bindings: {
    [key: string]: {
      exchange: string;
      queue: string;
      routingKey: string;
    };
  };
}

export class TopologyAssertService {
  private topologyConfig: RabbitMQTopologyConfig;
  private connectionUrl: string;

  constructor(topologyConfig: RabbitMQTopologyConfig, connectionUrl: string) {
    this.topologyConfig = topologyConfig;
    this.connectionUrl = connectionUrl;
  }

  async assertTopology() {
    const conn = await amqp.connect(this.connectionUrl);
    const channel = await conn.createConfirmChannel();

    await Promise.all(
      Object.keys(this.topologyConfig.exchanges || {}).map(
        async (exchangeName) => {
          const exchange = this.topologyConfig.exchanges[exchangeName];

          await channel.assertExchange(
            exchange.name,
            exchange.type,
            exchange.options,
          );
        },
      ),
    );

    await Promise.all(
      Object.keys(this.topologyConfig.queues || {}).map(async (queueName) => {
        const queue = this.topologyConfig.queues[queueName];

        await channel.assertQueue(queue.name, queue.options);
      }),
    );

    await Promise.all(
      Object.keys(this.topologyConfig.bindings || {}).map(
        async (bindingName) => {
          const binding = this.topologyConfig.bindings[bindingName];
          const queue = this.topologyConfig.queues[binding.queue];
          const exchange = this.topologyConfig.exchanges[binding.exchange];

          await channel.bindQueue(
            queue.name,
            exchange.name,
            binding.routingKey,
          );
        },
      ),
    );

    await channel.close();
    await conn.close();
  }
}
