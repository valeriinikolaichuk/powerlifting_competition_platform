import { PersistentSessionPolicy } from './persistent-session-policy';

describe('OfflineSessionPolicy', () => {
  it('should be defined', () => {
    expect(new PersistentSessionPolicy()).toBeDefined();
  });
});
