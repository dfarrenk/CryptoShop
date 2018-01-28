module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'UserAuth',
      externals: {
        react: 'React'
      }
    }
  }
}
