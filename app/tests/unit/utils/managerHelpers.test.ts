import { requestOpen } from '@/utils/managerHelpers';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';

describe('requestOpen', () => {
  let emitter: EventEmitter<TimepickerEventMap>;

  beforeEach(() => {
    emitter = new EventEmitter<TimepickerEventMap>();
  });

  it('should emit show and then open:request', () => {
    const order: string[] = [];
    emitter.on('show', () => order.push('show'));
    emitter.on('open:request', () => order.push('open:request'));

    requestOpen(emitter);

    expect(order).toEqual(['show', 'open:request']);
  });

  it('should still emit open:request when a show listener throws, then rethrow the error', () => {
    const error = new Error('show listener failed');
    const openRequest = jest.fn();
    emitter.on('show', () => {
      throw error;
    });
    emitter.on('open:request', openRequest);

    expect(() => requestOpen(emitter)).toThrow(error);
    expect(openRequest).toHaveBeenCalledTimes(1);
  });
});
