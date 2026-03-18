import PopoverManager from '../../../../src/managers/plugins/wheel/PopoverManager';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter } from '../../../../src/utils/EventEmitter';
import { mergeOptions } from '../../../../src/utils/options/defaults';

const INSTANCE_ID = 'test-uuid-1234-5678-9abc-def012345678';

function createDOM(): { container: HTMLDivElement; input: HTMLInputElement; modal: HTMLDivElement } {
  const container = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'text';
  container.appendChild(input);
  document.body.appendChild(container);

  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', INSTANCE_ID);
  modal.classList.add('tp-ui-wrapper');
  modal.style.width = '300px';
  modal.style.height = '200px';
  document.body.appendChild(modal);

  return { container, input, modal };
}

describe('PopoverManager', () => {
  let core: CoreState;
  let emitter: EventEmitter;
  let manager: PopoverManager;
  let container: HTMLDivElement;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    manager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('ignoreOutsideClick option', () => {
    describe('when ignoreOutsideClick is false (default)', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;

        const options = mergeOptions({
          ui: { mode: 'compact-wheel' },
          wheel: { placement: 'bottom', ignoreOutsideClick: false },
        });

        core = new CoreState(container, options, INSTANCE_ID);
        emitter = new EventEmitter();
        manager = new PopoverManager(core, emitter);
      });

      it('should emit cancel when clicking outside the picker', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });

        document.dispatchEvent(event);

        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when clicking inside the modal', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const modal = document.querySelector(`[data-owner-id="${INSTANCE_ID}"]`);
        const innerElement = document.createElement('span');
        modal?.appendChild(innerElement);

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: innerElement });

        document.dispatchEvent(event);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when clicking the input element', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const input = container.querySelector('input');

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: input });

        document.dispatchEvent(event);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });
    });

    describe('when ignoreOutsideClick is true', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;

        const options = mergeOptions({
          ui: { mode: 'compact-wheel' },
          wheel: { placement: 'bottom', ignoreOutsideClick: true },
        });

        core = new CoreState(container, options, INSTANCE_ID);
        emitter = new EventEmitter();
        manager = new PopoverManager(core, emitter);
      });

      it('should not emit cancel when clicking outside the picker', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });

        document.dispatchEvent(event);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when clicking inside the modal', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const modal = document.querySelector(`[data-owner-id="${INSTANCE_ID}"]`);
        const innerElement = document.createElement('span');
        modal?.appendChild(innerElement);

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: innerElement });

        document.dispatchEvent(event);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should keep picker open regardless of where the user clicks', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const targets = [
          document.createElement('div'),
          document.createElement('p'),
          document.createElement('button'),
        ];

        targets.forEach((target) => {
          document.body.appendChild(target);
          const event = new MouseEvent('pointerdown', { bubbles: true });
          Object.defineProperty(event, 'target', { value: target });
          document.dispatchEvent(event);
        });

        expect(emitSpy).not.toHaveBeenCalled();
      });
    });

    describe('when ignoreOutsideClick is undefined (default options)', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;

        const options = mergeOptions({
          ui: { mode: 'compact-wheel' },
          wheel: { placement: 'bottom' },
        });

        core = new CoreState(container, options, INSTANCE_ID);
        emitter = new EventEmitter();
        manager = new PopoverManager(core, emitter);
      });

      it('should emit cancel when clicking outside (falsy default)', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });

        document.dispatchEvent(event);

        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });
    });

    describe('when modal or target is missing', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;

        const options = mergeOptions({
          ui: { mode: 'compact-wheel' },
          wheel: { placement: 'bottom', ignoreOutsideClick: false },
        });

        core = new CoreState(container, options, INSTANCE_ID);
        emitter = new EventEmitter();
        manager = new PopoverManager(core, emitter);
      });

      it('should not emit cancel when modal element is missing', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const modal = document.querySelector(`[data-owner-id="${INSTANCE_ID}"]`);
        modal?.remove();

        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });

        document.dispatchEvent(event);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when event target is null', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        jest.runAllTimers();

        const event = new MouseEvent('pointerdown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: null });

        document.dispatchEvent(event);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });
    });
  });

  describe('destroy()', () => {
    beforeEach(() => {
      const dom = createDOM();
      container = dom.container;

      const options = mergeOptions({
        ui: { mode: 'compact-wheel' },
        wheel: { placement: 'bottom', ignoreOutsideClick: false },
      });

      core = new CoreState(container, options, INSTANCE_ID);
      emitter = new EventEmitter();
      manager = new PopoverManager(core, emitter);
    });

    it('should stop emitting cancel after destroy', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');
      manager.attach();

      jest.runAllTimers();

      manager.destroy();

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const event = new MouseEvent('pointerdown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement });

      document.dispatchEvent(event);

      expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
    });
  });
});

