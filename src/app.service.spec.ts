import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  test('hello world!', () => {
    expect(service).toBeDefined();
  });
});
