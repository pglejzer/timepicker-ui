import {
  getNumberOfHours24,
  getNumberOfHours12,
  getNumberOfMinutes,
  getModalTemplate,
  getMobileModalTemplate,
} from '../../../src/utils/template';
import { mockOptions, mockMobileOptions } from '../../helpers/mockOptions';

describe('utils/template', () => {
  describe('template constants', () => {
    it('should have correct 24h hours array', () => {
      expect(getNumberOfHours24).toEqual([
        '00',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ]);
      expect(getNumberOfHours24).toHaveLength(12);
    });

    it('should have correct 12h hours array', () => {
      expect(getNumberOfHours12).toEqual(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
      expect(getNumberOfHours12).toHaveLength(12);
    });

    it('should have correct minutes array', () => {
      expect(getNumberOfMinutes).toEqual([
        '00',
        '05',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
        '55',
      ]);
      expect(getNumberOfMinutes).toHaveLength(12);
    });
  });

  describe('getModalTemplate', () => {
    it('should generate modal template with 12h clock', () => {
      const template = getModalTemplate(mockOptions, 'test-id-123');

      expect(template).toContain('timepicker-ui-modal');
      expect(template).toContain('data-owner-id="test-id-123"');
      expect(template).toContain(mockOptions.timeLabel);
      expect(template).toContain(mockOptions.amLabel);
      expect(template).toContain(mockOptions.pmLabel);
      expect(template).toContain(mockOptions.cancelLabel);
      expect(template).toContain(mockOptions.okLabel);
    });

    it('should generate modal template with 24h clock', () => {
      const options = { ...mockOptions, clockType: '24h' as const };
      const template = getModalTemplate(options, 'test-id-456');

      expect(template).toContain('timepicker-ui-modal');
      expect(template).toContain('timepicker-ui-wrapper-time-24h');
      expect(template).toContain('timepicker-ui-tips-wrapper-24h');
      expect(template).not.toContain('timepicker-ui-am');
      expect(template).not.toContain('timepicker-ui-pm');
    });

    it('should include switch icon when enabled', () => {
      const options = { ...mockOptions, enableSwitchIcon: true };
      const template = getModalTemplate(options, 'test-id');

      expect(template).toContain('timepicker-ui-keyboard-icon-wrapper');
      expect(template).toContain(options.iconTemplate);
    });

    it('should not include switch icon when disabled', () => {
      const options = { ...mockOptions, enableSwitchIcon: false };
      const template = getModalTemplate(options, 'test-id');

      expect(template).not.toContain('timepicker-ui-keyboard-icon-wrapper');
    });

    it('should set readonly when editable is false', () => {
      const options = { ...mockOptions, editable: false };
      const template = getModalTemplate(options, 'test-id');

      expect(template).toContain('readonly');
    });

    it('should not set readonly when editable is true', () => {
      const options = { ...mockOptions, editable: true };
      const template = getModalTemplate(options, 'test-id');

      expect(template.match(/readonly/g)?.length).toBeUndefined();
    });

    it('should apply animation transition', () => {
      const options = { ...mockOptions, animation: true };
      const template = getModalTemplate(options, 'test-id');

      expect(template).toContain('transition:opacity 0.15s linear');
    });

    it('should not apply animation when disabled', () => {
      const options = { ...mockOptions, animation: false };
      const template = getModalTemplate(options, 'test-id');

      expect(template).toContain('transition:none');
    });

    it('should apply theme class', () => {
      const options = { ...mockOptions, theme: 'dark' as const };
      const template = getModalTemplate(options, 'test-id');

      expect(template).toContain('class="timepicker-ui-modal normalize dark"');
    });

    it('should set correct max hour for 12h', () => {
      const options = { ...mockOptions, clockType: '12h' as const };
      const template = getModalTemplate(options, 'test-id');

      expect(template).toContain('max="12"');
    });

    it('should set correct max hour for 24h', () => {
      const options = { ...mockOptions, clockType: '24h' as const };
      const template = getModalTemplate(options, 'test-id');

      expect(template).toContain('max="23"');
    });
  });

  describe('getMobileModalTemplate', () => {
    it('should generate mobile template with 12h clock', () => {
      const template = getMobileModalTemplate(mockMobileOptions, 'mobile-id-123');

      expect(template).toContain('timepicker-ui-modal');
      expect(template).toContain('mobile');
      expect(template).toContain('data-owner-id="mobile-id-123"');
      expect(template).toContain(mockMobileOptions.mobileTimeLabel);
      expect(template).toContain(mockMobileOptions.hourMobileLabel);
      expect(template).toContain(mockMobileOptions.minuteMobileLabel);
    });

    it('should generate mobile template with 24h clock', () => {
      const options = { ...mockMobileOptions, clockType: '24h' as const };
      const template = getMobileModalTemplate(options, 'mobile-id');

      expect(template).toContain('mobile');
      expect(template).not.toContain('timepicker-ui-am mobile');
      expect(template).not.toContain('timepicker-ui-pm mobile');
    });

    it('should include AM/PM for 12h clock', () => {
      const options = { ...mockMobileOptions, clockType: '12h' as const };
      const template = getMobileModalTemplate(options, 'mobile-id');

      expect(template).toContain('timepicker-ui-am mobile');
      expect(template).toContain('timepicker-ui-pm mobile');
      expect(template).toContain(options.amLabel);
      expect(template).toContain(options.pmLabel);
    });

    it('should include mobile icon template when enabled', () => {
      const options = { ...mockMobileOptions, enableSwitchIcon: true };
      const template = getMobileModalTemplate(options, 'mobile-id');

      expect(template).toContain('timepicker-ui-keyboard-icon-wrapper mobile');
      expect(template).toContain(options.iconTemplateMobile);
    });

    it('should apply animation to mobile modal', () => {
      const options = { ...mockMobileOptions, animation: true };
      const template = getMobileModalTemplate(options, 'mobile-id');

      expect(template).toContain('transition:opacity 0.15s linear');
    });

    it('should apply theme to mobile modal', () => {
      const options = { ...mockMobileOptions, theme: 'crane-straight' as const };
      const template = getMobileModalTemplate(options, 'mobile-id');

      expect(template).toContain('class="timepicker-ui-modal normalize mobile crane-straight"');
    });

    it('should set correct max hour for mobile 12h', () => {
      const options = { ...mockMobileOptions, clockType: '12h' as const };
      const template = getMobileModalTemplate(options, 'mobile-id');

      expect(template).toContain('max="12"');
    });

    it('should set correct max hour for mobile 24h', () => {
      const options = { ...mockMobileOptions, clockType: '24h' as const };
      const template = getMobileModalTemplate(options, 'mobile-id');

      expect(template).toContain('max="23"');
    });

    it('should include cancel and ok buttons', () => {
      const template = getMobileModalTemplate(mockMobileOptions, 'mobile-id');

      expect(template).toContain('timepicker-ui-cancel-btn mobile');
      expect(template).toContain('timepicker-ui-ok-btn mobile');
      expect(template).toContain(mockMobileOptions.cancelLabel);
      expect(template).toContain(mockMobileOptions.okLabel);
    });
  });
});

