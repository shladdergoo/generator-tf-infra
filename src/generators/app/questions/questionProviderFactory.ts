import { AwsQuestionProvider } from './awsQuestionProvider';
import { GcpQuestionProvider } from './gcpQuestionProvider';
import { IQuestionProvider } from './iQuestionProvider';

export class QuestionProviderFactory {
  public static getQuestionProvider(provider: string): IQuestionProvider {
    if (provider === 'gcp') {
      return new GcpQuestionProvider();
    }

    return new AwsQuestionProvider();
  }
}
