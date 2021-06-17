import * as Generator from 'yeoman-generator';

import { Defaults } from '../defaults';
import { IQuestionProvider } from './iQuestionProvider';

export class AwsQuestionProvider implements IQuestionProvider {
  public GetQuestions(): Generator.Questions<any> {
    return [
      {
        default: Defaults.GetDefaultRegion('aws'),
        message: 'Region',
        name: 'region',
        type: 'input',
      },
      {
        default: Defaults.envListDefault,
        message: 'Environments (comma separated)',
        name: 'environments',
        type: 'input',
      },
      {
        default: Defaults.stateBucketDefault,
        message: 'Backend state bucket',
        name: 'stateBucket',
        type: 'input',
      },
      {
        default: Defaults.stateKeyDefault,
        message: 'Backend state key',
        name: 'stateKey',
        type: 'input',
      },
      {
        default: Defaults.lockTableDefault,
        message: 'Backend lock table',
        name: 'lockTable',
        type: 'input',
      },
      {
        default: Defaults.sampleModuleDefault,
        message: 'Create sample module (VPC)?',
        name: 'createSampleModule',
        type: 'confirm',
      },
    ];
  }
}
