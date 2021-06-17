import * as Generator from 'yeoman-generator';

export interface IQuestionProvider {
  GetQuestions(): Generator.Questions<any>;
}
