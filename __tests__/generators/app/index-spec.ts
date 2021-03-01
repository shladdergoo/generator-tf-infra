import * as app from '../../../src/generators/app';

import * as path from 'path';

import * as assert from 'yeoman-assert';
import * as helpers from 'yeoman-test';

const appModule = '../../../lib/generators/app';

test('Should export default class', () => {
  expect(app.default).toBeTruthy();
});

test('Should create static files', async () => {
  const expected = ['.gitignore', '.gitattributes', 'Makefile'];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ provider: 'aws' });

  assert.file(expected);
});

test('Should create readme', async () => {
  const expected = ['README.md'];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ provider: 'aws' });

  assert.file(expected);
});

test('Should create environments', async () => {
  const expected = [
    'environments/env1/backend.tf',
    'environments/env1/variables.tf',
    'environments/env2/backend.tf',
    'environments/env2/variables.tf',
  ];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ environments: 'env1,env2', provider: 'aws' });

  assert.file(expected);
});

test('Should create module', async () => {
  const expected = [
    'modules/someModule/main.tf',
    'modules/someModule/variables.tf',
    'modules/someModule/outputs.tf',
  ];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ initialModule: 'someModule', provider: 'aws' });

  assert.file(expected);
});

test('Should create example', async () => {
  const expected = [
    'examples/someModule/main.tf',
    'examples/someModule/variables.tf',
    'examples/someModule/outputs.tf',
    'examples/someModule/dependencies.tf',
    'examples/someModule/README.md',
  ];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ initialModule: 'someModule', provider: 'aws' });

  assert.file(expected);
});
