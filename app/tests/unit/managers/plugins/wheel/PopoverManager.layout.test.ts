import {
  computePopoverLayout,
  type PopoverAnchorRect,
  type PopoverLayoutInput,
} from '@/managers/plugins/wheel/PopoverManager';

const DEFAULT_TOKENS = { gap: 4, minWidth: 260, maxWidth: 328, edgeMargin: 4 };
const WHEEL_12H_WITH_SECONDS = 312;
const WRAPPER_BORDER = 2;
const PICKER_HEIGHT = 300;
const WHEEL_ITEM_HEIGHT = 44;
const MIN_HEIGHT = 3 * WHEEL_ITEM_HEIGHT;

const anchorAt = (top: number, left: number, width = 200, height = 40): PopoverAnchorRect => ({
  top,
  left,
  width,
  bottom: top + height,
  right: left + width,
});

const layout = (overrides: Partial<PopoverLayoutInput> = {}) =>
  computePopoverLayout({
    anchor: anchorAt(100, 50),
    contentWidth: 0,
    pickerHeight: PICKER_HEIGHT,
    minHeight: MIN_HEIGHT,
    layoutWidth: 1024,
    viewport: { width: 1024, height: 768, offsetLeft: 0, offsetTop: 0 },
    tokens: DEFAULT_TOKENS,
    request: 'auto',
    rtl: false,
    pixelRatio: 1,
    ...overrides,
  });

describe('computePopoverLayout', () => {
  describe('width', () => {
    it('sizes the picker to the wheel content plus the wrapper border', () => {
      expect(layout({ contentWidth: WHEEL_12H_WITH_SECONDS + WRAPPER_BORDER }).width).toBe(314);
    });

    it('caps the width at the max-width token', () => {
      expect(layout({ contentWidth: 400 }).width).toBe(328);
    });

    it('never goes below the min-width token', () => {
      expect(layout({ anchor: anchorAt(100, 50, 120), contentWidth: 200 }).width).toBe(260);
    });

    it('matches a wide input between the floor and the cap', () => {
      expect(layout({ anchor: anchorAt(100, 50, 300) }).width).toBe(300);
    });

    it('clamps the width to the layout width minus both edge margins', () => {
      const result = layout({
        contentWidth: WHEEL_12H_WITH_SECONDS + WRAPPER_BORDER,
        layoutWidth: 300,
        viewport: { width: 300, height: 768, offsetLeft: 0, offsetTop: 0 },
      });

      expect(result.width).toBe(292);
      expect(result.left).toBe(4);
    });

    it('keeps the layout width under pinch zoom and pins the picker inside the visual viewport', () => {
      const result = layout({
        anchor: anchorAt(50, 150, 120),
        contentWidth: WHEEL_12H_WITH_SECONDS + WRAPPER_BORDER,
        layoutWidth: 400,
        viewport: { width: 200, height: 400, offsetLeft: 100, offsetTop: 0 },
      });

      expect(result.width).toBe(314);
      expect(result.left).toBe(104);
    });

    it('honours custom tokens for width, gap and edge margin', () => {
      const tokens = { gap: 8, minWidth: 200, maxWidth: 400, edgeMargin: 16 };

      expect(layout({ tokens, anchor: anchorAt(100, 0, 150), contentWidth: 180 })).toEqual({
        top: 148,
        left: 16,
        width: 200,
        placement: 'bottom',
        availableHeight: null,
      });
      expect(layout({ tokens, contentWidth: 380, layoutWidth: 400 }).width).toBe(368);
    });
  });

  describe('vertical placement', () => {
    it('places the picker below the input when it fits there', () => {
      expect(layout()).toMatchObject({ placement: 'bottom', top: 144, availableHeight: null });
    });

    it('places the picker above the input when it only fits above', () => {
      expect(layout({ anchor: anchorAt(600, 50) })).toMatchObject({
        placement: 'top',
        top: 296,
        availableHeight: null,
      });
    });

    it('treats an exact fit below as fitting', () => {
      expect(layout({ anchor: anchorAt(420, 50) })).toMatchObject({
        placement: 'bottom',
        top: 464,
        availableHeight: null,
      });
    });

    it.each([
      ['below is larger', 400, 150, { placement: 'bottom', top: 194, availableHeight: 202 }],
      ['above is larger', 400, 250, { placement: 'top', top: 4, availableHeight: 242 }],
      ['both sides are equal', 300, 130, { placement: 'bottom', top: 174, availableHeight: 122 }],
    ])(
      'uses the larger side and constrains the height when neither fits and %s',
      (_case, viewportHeight, anchorTop, expected) => {
        const result = layout({
          anchor: anchorAt(anchorTop, 50),
          viewport: { width: 1024, height: viewportHeight, offsetLeft: 0, offsetTop: 0 },
        });

        expect(result).toMatchObject(expected);
      },
    );

    it('keeps a forced top placement even when there is room below', () => {
      expect(layout({ request: 'top', anchor: anchorAt(400, 50) })).toMatchObject({
        placement: 'top',
        top: 96,
        availableHeight: null,
      });
    });

    it('keeps a forced bottom placement and constrains it when there is more room above', () => {
      expect(layout({ request: 'bottom', anchor: anchorAt(500, 50) })).toMatchObject({
        placement: 'bottom',
        top: 544,
        availableHeight: 220,
      });
    });

    it('never reports a negative available height when the input leaves no room on either side', () => {
      const anchor = anchorAt(-20, 50, 200, 808);

      expect(layout({ request: 'bottom', anchor })).toMatchObject({
        placement: 'bottom',
        availableHeight: 0,
      });
      expect(layout({ request: 'top', anchor })).toMatchObject({
        placement: 'top',
        availableHeight: 0,
      });
    });

    it('clamps the top edge to the visual viewport top plus the edge margin', () => {
      expect(layout({ request: 'top', anchor: anchorAt(-20, 50, 200, 808) }).top).toBe(4);
      expect(layout({ anchor: anchorAt(-100, 50) })).toMatchObject({ placement: 'bottom', top: 4 });
      expect(
        layout({
          request: 'bottom',
          anchor: anchorAt(0, 50),
          viewport: { width: 1024, height: 768, offsetLeft: 0, offsetTop: 100 },
        }).top,
      ).toBe(104);
    });
  });

  describe('forced placement with too little room', () => {
    const { gap, edgeMargin } = DEFAULT_TOKENS;

    const withRoom = (above: number, below: number): Pick<PopoverLayoutInput, 'anchor' | 'viewport'> => {
      const anchor = anchorAt(above + gap + edgeMargin, 50);
      return {
        anchor,
        viewport: {
          width: 1024,
          height: anchor.bottom + gap + edgeMargin + below,
          offsetLeft: 0,
          offsetTop: 0,
        },
      };
    };

    describe('top request', () => {
      it('opens below when the input sits at the viewport top', () => {
        const anchor = anchorAt(0, 50);

        expect(layout({ request: 'top', anchor })).toMatchObject({
          placement: 'bottom',
          top: anchor.bottom + gap,
          availableHeight: null,
        });
      });

      it.each([
        ['exactly minHeight', MIN_HEIGHT],
        ['between minHeight and the picker height', 250],
      ])('stays above and caps the height when the room above is %s', (_case, above) => {
        const room = withRoom(above, 400);
        const result = layout({ request: 'top', ...room });

        expect(result).toMatchObject({ placement: 'top', availableHeight: above });
        expect(result.top + above).toBe(room.anchor.top - gap);
      });

      it('opens below when the room above is just under minHeight and below has more', () => {
        const room = withRoom(MIN_HEIGHT - 1, 400);

        expect(layout({ request: 'top', ...room })).toMatchObject({
          placement: 'bottom',
          top: room.anchor.bottom + gap,
          availableHeight: null,
        });
      });

      it.each([
        ['less', 80],
        ['the same', 100],
      ])(
        'stays above and capped when the room above is under minHeight and below has %s room',
        (_case, below) => {
          expect(layout({ request: 'top', ...withRoom(100, below) })).toMatchObject({
            placement: 'top',
            top: edgeMargin,
            availableHeight: 100,
          });
        },
      );
    });

    describe('bottom request', () => {
      it('opens above when the input sits at the viewport bottom', () => {
        const anchor = anchorAt(728, 50);

        expect(layout({ request: 'bottom', anchor })).toMatchObject({
          placement: 'top',
          top: anchor.top - gap - PICKER_HEIGHT,
          availableHeight: null,
        });
      });

      it.each([
        ['exactly minHeight', MIN_HEIGHT],
        ['between minHeight and the picker height', 250],
      ])('stays below and caps the height when the room below is %s', (_case, below) => {
        const room = withRoom(400, below);
        const result = layout({ request: 'bottom', ...room });

        expect(result).toMatchObject({
          placement: 'bottom',
          top: room.anchor.bottom + gap,
          availableHeight: below,
        });
        expect(result.top + below).toBe(room.viewport.height - edgeMargin);
      });

      it('opens above when the room below is just under minHeight and above has more', () => {
        const room = withRoom(400, MIN_HEIGHT - 1);

        expect(layout({ request: 'bottom', ...room })).toMatchObject({
          placement: 'top',
          top: room.anchor.top - gap - PICKER_HEIGHT,
          availableHeight: null,
        });
      });

      it.each([
        ['less', 80],
        ['the same', 100],
      ])(
        'stays below and capped when the room below is under minHeight and above has %s room',
        (_case, above) => {
          const room = withRoom(above, 100);

          expect(layout({ request: 'bottom', ...room })).toMatchObject({
            placement: 'bottom',
            top: room.anchor.bottom + gap,
            availableHeight: 100,
          });
        },
      );
    });

    describe('picker shorter than minHeight', () => {
      const SHORT_PICKER = 100;

      it('stays above without capping when the short picker fits above', () => {
        const room = withRoom(SHORT_PICKER, 400);

        expect(layout({ request: 'top', pickerHeight: SHORT_PICKER, ...room })).toMatchObject({
          placement: 'top',
          top: room.anchor.top - gap - SHORT_PICKER,
          availableHeight: null,
        });
      });

      it('opens below once the room above drops under the short picker', () => {
        const room = withRoom(SHORT_PICKER - 1, 400);

        expect(layout({ request: 'top', pickerHeight: SHORT_PICKER, ...room })).toMatchObject({
          placement: 'bottom',
          top: room.anchor.bottom + gap,
          availableHeight: null,
        });
      });
    });

    it.each([
      ['at the viewport top', { anchor: anchorAt(0, 50) }],
      ['in the middle of the viewport', { anchor: anchorAt(400, 50) }],
      ['at the viewport bottom', { anchor: anchorAt(728, 50) }],
      [
        'with less than minHeight on either side',
        { anchor: anchorAt(100, 50), viewport: { width: 1024, height: 250, offsetLeft: 0, offsetTop: 0 } },
      ],
    ] as Array<[string, Partial<PopoverLayoutInput>]>)(
      'ignores minHeight for an auto request with the input %s',
      (_case, input) => {
        expect(layout({ ...input, minHeight: 0 })).toEqual(layout({ ...input, minHeight: 500 }));
      },
    );
  });

  describe('horizontal alignment', () => {
    it('aligns the left edges in left-to-right layouts', () => {
      expect(layout({ anchor: anchorAt(100, 500), contentWidth: 314 }).left).toBe(500);
    });

    it('aligns the right edges in right-to-left layouts', () => {
      expect(layout({ anchor: anchorAt(100, 500), contentWidth: 314, rtl: true }).left).toBe(386);
    });

    it('clamps to the right viewport edge', () => {
      expect(layout({ anchor: anchorAt(100, 900) }).left).toBe(760);
    });

    it('clamps to the left viewport edge in right-to-left layouts', () => {
      expect(layout({ anchor: anchorAt(100, 4, 100), rtl: true }).left).toBe(4);
    });

    it('measures every clamp from the visual viewport offsets', () => {
      const viewport = { width: 400, height: 600, offsetLeft: 200, offsetTop: 300 };

      expect(layout({ viewport, anchor: anchorAt(350, 150) })).toMatchObject({
        placement: 'bottom',
        top: 394,
        left: 204,
        width: 260,
      });
      expect(layout({ viewport, anchor: anchorAt(350, 500) }).left).toBe(336);
    });
  });

  describe('device pixel rounding', () => {
    it.each([
      [1, { top: 145, left: 50, width: 314 }],
      [2, { top: 144.5, left: 50.5, width: 314.5 }],
      [3, { top: 434 / 3, left: 151 / 3, width: 943 / 3 }],
    ])('snaps top, left and width to device pixels at pixel ratio %d', (pixelRatio, expected) => {
      const result = layout({
        anchor: { top: 100.6, bottom: 140.6, left: 50.3, right: 250.3, width: 200 },
        contentWidth: 314.4,
        request: 'bottom',
        pixelRatio,
      });

      expect(result).toMatchObject(expected);
    });
  });
});
