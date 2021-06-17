export class Defaults {
  public static providers = [
    { provider: 'aws', defaultRegion: 'us-east-1' },
    { provider: 'gcp', defaultRegion: 'us-west1' },
  ];
  public static envListDefault = ['dev', 'staging', 'prod'];
  public static stateBucketDefault = 'terraform-state';
  public static stateKeyDefault = 'terraform.tfstate';
  public static lockTableDefault = 'terraform-locks';
  public static sampleModuleDefault = false;
  public static sampleModuleName = 'vpc';
  public static dirEnvironments = 'environments';
  public static dirModules = 'modules';
  public static dirExamples = 'examples';
  public static dirTests = 'tests';
  public static fileMain = 'main.tf';
  public static fileVariables = 'variables.tf';
  public static fileOutputs = 'outputs.tf';
  public static fileDependencies = 'dependencies.tf';
  public static statciFiles = [
    ['dotgitignore', '.gitignore'],
    ['dotgitattributes', '.gitattributes'],
  ];

  public static GetDefaultRegion(provider: string): string | undefined {
    return Defaults.providers.find(p => p.provider === provider)?.defaultRegion;
  }
}
