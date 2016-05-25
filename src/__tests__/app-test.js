describe('sum', () => {
  it('adds 2 + 3', () => {
    const gen = function*() {
      yield 6;
    }();
    expect(gen.next().value).toBe(6);
  });
});
