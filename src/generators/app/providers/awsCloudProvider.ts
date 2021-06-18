import * as Generator from 'yeoman-generator';

import { Defaults } from '../defaults';
import { ICloudProvider } from './iCloudProvider';

const prvdr = 'aws';

export class AwsCloudProvider implements ICloudProvider {
  private project: string;

  public constructor(project: string) {
    this.project = project;
  }

  public GetQuestions(): Generator.Questions<any> {
    return [
      {
        default: Defaults.GetDefaultRegion(prvdr),
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

  public GetTemplateData(answers: any): Map<string, any> {
    const templateMap: Map<string, any> = new Map();

    this._setEnvBackends(templateMap, answers);
    this._setEnvVariables(templateMap, answers);
    this._setMainVariables(templateMap, answers);
    this._setMainModuleImpl(templateMap);
    this._setExampleReadme(templateMap);

    return templateMap;
  }

  private _setEnvBackends(templateMap: Map<string, any>, answers: any) {
    answers.environments.forEach((env: string) => {
      templateMap.set(`backend_${env}`, {
        bucket: answers.stateBucket,
        key: `${env}/${Defaults.stateKeyDefault}`,
        region: answers.region,
        table: `${env}-${answers.lockTable}`,
      });
    });
  }

  private _setEnvVariables(templateMap: Map<string, any>, answers: any) {
    answers.environments.forEach((env: string) => {
      templateMap.set(`variable_${env}`, {
        env: `${env}`,
      });
    });
  }

  private _setMainVariables(templateMap: Map<string, any>, answers: any) {
    templateMap.set(`variable_main`, { region: answers.region });
  }

  private _setMainModuleImpl(templateMap: Map<string, any>) {
    templateMap.set('main_module', { project: this.project });
  }

  private _setExampleReadme(templateMap: Map<string, any>) {
    templateMap.set('example_readme', { module: Defaults.sampleModuleName });
  }
}
