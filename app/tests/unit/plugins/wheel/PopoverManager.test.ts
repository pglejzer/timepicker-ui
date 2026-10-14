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

function pointerDownOn(target: EventTarget): void {
  target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }));
}

function appendOutsideElement(tagName = 'div'): HTMLElement {
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  return element;
}

describe('PopoverManager', () => {
  let core: CoreState;
  let emitter: EventEmitter;
  let manager: PopoverManager;
  let container: HTMLDivElement;
  let modal: HTMLDivElement;

  afterEach(() => {
    manager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('ignoreOutsideClick option', () => {
    describe('when ignoreOutsideClick is false (default)', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;
        modal = dom.modal;

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

        pointerDownOn(appendOutsideElement());

        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });

      it('should emit cancel even when the outside target stops propagation', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();
        const outsideElement = appendOutsideElement();
        outsideElement.addEventListener('pointerdown', (event) => event.stopPropagation());

        pointerDownOn(outsideElement);

        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when clicking inside the modal', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();
        const innerElement = document.createElement('span');
        modal.appendChild(innerElement);

        pointerDownOn(innerElement);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when clicking the input element', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        pointerDownOn(container.querySelector('input') as HTMLInputElement);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });
    });

    describe('when ignoreOutsideClick is true', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;
        modal = dom.modal;

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

        pointerDownOn(appendOutsideElement());

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel when clicking inside the modal', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();
        const innerElement = document.createElement('span');
        modal.appendChild(innerElement);

        pointerDownOn(innerElement);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should keep picker open regardless of where the user clicks', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();

        ['div', 'p', 'button'].forEach((tagName) => pointerDownOn(appendOutsideElement(tagName)));
        pointerDownOn(document.body);

        expect(emitSpy).not.toHaveBeenCalled();
      });
    });

    describe('when ignoreOutsideClick is undefined (default options)', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;
        modal = dom.modal;

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

        pointerDownOn(appendOutsideElement());

        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });
    });

    describe('after detach and across shadow roots', () => {
      beforeEach(() => {
        const dom = createDOM();
        container = dom.container;
        modal = dom.modal;

        const options = mergeOptions({
          ui: { mode: 'compact-wheel' },
          wheel: { placement: 'bottom', ignoreOutsideClick: false },
        });

        core = new CoreState(container, options, INSTANCE_ID);
        emitter = new EventEmitter();
        manager = new PopoverManager(core, emitter);
      });

      it('should not emit cancel after detach()', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        const outsideElement = appendOutsideElement();
        manager.attach();
        pointerDownOn(outsideElement);

        manager.detach();
        pointerDownOn(outsideElement);

        expect(emitSpy).toHaveBeenCalledTimes(1);
        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });

      it('should not emit cancel for a pointerdown inside an open shadow root within the modal', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();
        const host = document.createElement('div');
        modal.appendChild(host);
        const shadowButton = document.createElement('button');
        host.attachShadow({ mode: 'open' }).appendChild(shadowButton);

        pointerDownOn(shadowButton);

        expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
      });

      it('should emit cancel for a pointerdown inside a shadow root outside the picker', () => {
        const emitSpy = jest.spyOn(emitter, 'emit');
        manager.attach();
        const host = appendOutsideElement();
        const shadowButton = document.createElement('button');
        host.attachShadow({ mode: 'open' }).appendChild(shadowButton);

        pointerDownOn(shadowButton);

        expect(emitSpy).toHaveBeenCalledWith('cancel', {});
      });
    });
  });

  describe('destroy()', () => {
    beforeEach(() => {
      const dom = createDOM();
      container = dom.container;
      modal = dom.modal;

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

      manager.destroy();
      pointerDownOn(appendOutsideElement());

      expect(emitSpy).not.toHaveBeenCalledWith('cancel', {});
    });
  });
});
