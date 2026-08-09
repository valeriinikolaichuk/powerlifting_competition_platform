import { RefreshableSessionPolicy } from './refreshable-session-policy';

describe('OnlineSessionPolicy', () => {
  it('should be defined', () => {
    expect(new RefreshableSessionPolicy()).toBeDefined();
  });
});
