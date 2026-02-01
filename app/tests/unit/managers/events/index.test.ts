import * as eventsIndex from '../../../../src/managers/events/index';
import { ButtonHandlers } from '../../../../src/managers/events/ButtonHandlers';
import { InputHandlers } from '../../../../src/managers/events/InputHandlers';
import { KeyboardHandlers } from '../../../../src/managers/events/KeyboardHandlers';
import { ModalHandlers } from '../../../../src/managers/events/ModalHandlers';

describe('managers/events index exports', () => {
  it('should export ButtonHandlers', () => {
    expect(eventsIndex.ButtonHandlers).toBe(ButtonHandlers);
  });

  it('should export InputHandlers', () => {
    expect(eventsIndex.InputHandlers).toBe(InputHandlers);
  });

  it('should export KeyboardHandlers', () => {
    expect(eventsIndex.KeyboardHandlers).toBe(KeyboardHandlers);
  });

  it('should export ModalHandlers', () => {
    expect(eventsIndex.ModalHandlers).toBe(ModalHandlers);
  });

  it('should export exactly 4 handlers', () => {
    const exportKeys = Object.keys(eventsIndex);
    expect(exportKeys).toHaveLength(4);
    expect(exportKeys).toEqual(
      expect.arrayContaining(['ButtonHandlers', 'InputHandlers', 'KeyboardHandlers', 'ModalHandlers']),
    );
  });
});

