import * as Generator from 'yeoman-generator';

import { Defaults } from '../defaults';
import { IQuestionProvider } from './iQuestionProvider';

export class GcpQuestionProvider implements IQuestionProvider {
  public GetQuestions(): Generator.Questions<any> {
    return [
      {
        default: Defaults.GetDefaultRegion('gcp'),
        message: 'Region',
        name: 'region',
        type: 'input',
      },
    ];
  }
}
