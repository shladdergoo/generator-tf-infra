import { AwsCloudProvider } from './awsCloudProvider';
import { GcpCloudProvider } from './gcpCloudProvider';
import { ICloudProvider } from './iCloudProvider';

export class CloudProviderFactory {
  public static getProvider(provider: string, project: string): ICloudProvider {
    if (provider === 'gcp') {
      return new GcpCloudProvider();
    }

    return new AwsCloudProvider(project);
  }
}
