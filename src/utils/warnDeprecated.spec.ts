import { warnDeprecated } from './warnDeprecated';

// warnDeprecated remembers names for the whole test file, so every test uses its own names.
describe('warnDeprecated', () => {
  afterEach(() => jest.restoreAllMocks());

  it('warns once per name, with the replacement', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    warnDeprecated('OldThing', 'Use NewThing.');
    warnDeprecated('OldThing', 'Use NewThing.');
    warnDeprecated('OtherOldThing', 'Use OtherNewThing.');

    expect(consoleWarn).toHaveBeenCalledTimes(2);
    expect(consoleWarn.mock.calls[0][0]).toContain('OldThing is deprecated');
    expect(consoleWarn.mock.calls[0][0]).toContain('Use NewThing.');
  });

  it('stays silent in production', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const originalNodeEnvironment = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: 'production' });

    warnDeprecated('ProductionThing', 'Use NewThing.');

    Object.assign(process.env, { NODE_ENV: originalNodeEnvironment });
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});
