import { Injectable } from '@nestjs/common';
import * as config from 'config';

@Injectable()
export class ConfigService {
  public get<T>(path): T {
    return config.get<T>(path);
  }

  public has(path): boolean {
    return config.has(path);
  }
}
