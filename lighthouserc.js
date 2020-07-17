module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: ['http://localhost:9999'],
      staticDistDir: './',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
