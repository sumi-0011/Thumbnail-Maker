module.exports = {
  'src/**/*.{ts,tsx}': ['prettier --write', 'eslint --cache --fix --quiet'],
  'src/**/*.{js,jsx}': ['prettier --write', 'eslint --cache --fix --quiet'],
  'src/**/*.less': ['prettier --write', 'stylelint --fix'],
  'src/**/*.css': ['prettier --write', 'stylelint --fix'],
  'src/**/*.{json,md}': ['prettier --write'],
}
