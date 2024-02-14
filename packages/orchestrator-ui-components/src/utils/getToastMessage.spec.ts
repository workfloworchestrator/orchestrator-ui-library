import { ToastTypes } from '../types';
import { getToastMessage } from './getToastMessage';

describe('getToastMessage()', () => {
    it('returns message object with title, text and passed in type', () => {
        const result = getToastMessage(ToastTypes.ERROR, 'text', 'title');
        expect(result.title).toBe('title');
        expect(result.text).toBe('text');
    });

    it('returns message object with random integer id', () => {
        const result = getToastMessage(ToastTypes.ERROR, 'text', 'title');
        const result2 = getToastMessage(ToastTypes.ERROR, 'text', 'title');
        expect(result.id).not.toBe(result2.id);
    });

    it('returns message object with ToastTypes.Error to color danger and iconType warning', () => {
        const result = getToastMessage(ToastTypes.ERROR, 'text', 'title');
        expect(result.color).toBe('danger');
        expect(result.iconType).toBe('warning');
    });

    it('returns message object with ToastTypes.Error to color success and iconType check', () => {
        const result = getToastMessage(ToastTypes.SUCCESS, 'text', 'title');
        expect(result.color).toBe('success');
        expect(result.iconType).toBe('check');
    });
});
