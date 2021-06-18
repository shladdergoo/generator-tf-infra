import * as Generator from 'yeoman-generator';

export interface ICloudProvider {
  GetQuestions(): Generator.Questions<any>;
  GetTemplateData(answers: any): Map<string, any>;
}
