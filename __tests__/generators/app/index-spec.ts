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

test('Should not create sample module when not requested', async () => {
  const notExpected = [
    'modules/vpc/main.tf',
    'modules/vpc/variables.tf',
    'modules/vpc/outputs.tf',
  ];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ provider: 'aws' });

  assert.noFile(notExpected);
});

test('Should not create examples when sample not requested', async () => {
  const notExpected = [
    'examples/vpc/main.tf',
    'examples/vpc/variables.tf',
    'examples/vpc/outputs.tf',
    'examples/vpc/dependencies.tf',
    'examples/vpc/README.md',
  ];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ initialModule: 'someModule', provider: 'aws' });

  assert.noFile(notExpected);
});

test('Should create sample module when requested', async () => {
  const expected = [
    'modules/vpc/main.tf',
    'modules/vpc/variables.tf',
    'modules/vpc/outputs.tf',
  ];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ provider: 'aws', createSampleModule: true });

  assert.file(expected);
});

test('Should create examples when sample requested', async () => {
  const expected = [
    'examples/vpc/main.tf',
    'examples/vpc/variables.tf',
    'examples/vpc/outputs.tf',
    'examples/vpc/dependencies.tf',
    'examples/vpc/README.md',
  ];

  await helpers
    .run(path.join(__dirname, appModule))
    .withPrompts({ provider: 'aws', createSampleModule: true });

  assert.file(expected);
});
