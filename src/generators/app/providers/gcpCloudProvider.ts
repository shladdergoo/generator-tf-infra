import * as Generator from 'yeoman-generator';

import { Defaults } from '../defaults';
import { ICloudProvider } from './iCloudProvider';

export class GcpCloudProvider implements ICloudProvider {
  public GetQuestions(): Generator.Questions<any> {
    return [
      {
        default: Defaults.GetDefaultRegion('gcp'),
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
    ];
  }

  public GetTemplateData(answers: any): Map<string, any> {
    const templateMap: Map<string, any> = new Map();

    templateMap.set('env', {
      bucket: answers.stateBucket,
      key: `${Defaults.stateKeyDefault}`,
      region: answers.region,
      table: `${answers.lockTable}`,
    });

    return templateMap;
  }
}
