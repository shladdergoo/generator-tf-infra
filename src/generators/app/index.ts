import * as Generator from 'yeoman-generator';
import yosay = require('yosay');

export default class extends Generator {
  private answers: any;
  private providers = ['aws'];
  private regionDefault = 'us-east-1';
  private envListDefault = ['dev', 'staging', 'prod'];
  private stateBucketDefault = 'terraform-state';
  private stateKeyDefault = 'terraform.tfstate';
  private lockTableDefault = 'terraform-locks';
  private initialModuleDefault = 'module1';
  private dirEnvironments = 'environments';
  private dirModules = 'modules';
  private dirExamples = 'examples';
  private fileMain = 'main.tf';
  private fileVariables = 'variables.tf';
  private fileOutputs = 'outputs.tf';
  private fileDependencies = 'dependencies.tf';
  private statciFiles = [
    ['.gitignore', '.gitignore'],
    ['.gitattributes', '.gitattributes'],
    ['README.md', 'README.md'],
    ['Makefile', 'Makefile'],
  ];

  public constructor(args: any, opts: any) {
    super(args, opts);
  }

  public initializing(): void {
    this.log(yosay('Woot!'));
  }

  public async prompting() {
    this.answers = await this._getAnswers();
    this.answers.environments = this._ensureArray(this.answers.environments);
  }

  public writing(): void {
    this.log('copying files');
    this.log('environments', this.answers.environments);

    this._copyStaticFiles();
    this._createEnvironments();
    this._createMain();
    this._createModule();
    this._createExample();
  }

  private _copyStaticFiles(): void {
    this.statciFiles.forEach(fileCopyTuple => {
      this.fs.copy(
        this.templatePath(fileCopyTuple[0]),
        this.destinationPath(fileCopyTuple[1])
      );
    });
  }

  private _createEnvironments(): void {
    this.answers.environments.forEach((env: string) => {
      this.fs.copyTpl(
        this.templatePath('env/backend.tf'),
        this.destinationPath(`${this.dirEnvironments}/${env}/backend.tf`),
        {
          bucket: this.answers.stateBucket,
          key: `${env}/${this.stateKeyDefault}`,
          region: this.answers.region,
          table: `${env}-${this.answers.lockTable}`,
        }
      );

      this.fs.copyTpl(
        this.templatePath(`env/${this.fileVariables}`),
        this.destinationPath(
          `${this.dirEnvironments}/${env}/${this.fileVariables}`
        ),
        {
          env: `${env}`,
        }
      );
    });
  }

  private _createMain(): void {
    this.fs.copyTpl(
      this.templatePath(this.fileMain),
      this.destinationPath(this.fileMain),
      { provider: this.answers.provider }
    );

    this.fs.copyTpl(
      this.templatePath(this.fileVariables),
      this.destinationPath(this.fileVariables),
      { region: this.answers.region }
    );
  }

  private _createModule() {
    this.fs.copy(
      this.templatePath(`module/${this.fileMain}`),
      this.destinationPath(
        `${this.dirModules}/${this.answers.initialModule}/${this.fileMain}`
      )
    );

    this.fs.copy(
      this.templatePath(`module/${this.fileVariables}`),
      this.destinationPath(
        `${this.dirModules}/${this.answers.initialModule}/${this.fileVariables}`
      )
    );

    this.fs.copy(
      this.templatePath(`module/${this.fileOutputs}`),
      this.destinationPath(
        `${this.dirModules}/${this.answers.initialModule}/${this.fileOutputs}`
      )
    );
  }

  private _createExample() {
    const exampleFiles = [
      this.fileMain,
      this.fileVariables,
      this.fileDependencies,
      this.fileOutputs,
    ];

    exampleFiles.forEach((filename: string) => {
      this.fs.copy(
        this.templatePath(`example/${filename}`),
        this.destinationPath(
          `${this.dirExamples}/${this.answers.initialModule}/${filename}`
        )
      );
    });

    this.fs.copyTpl(
      this.templatePath('example/README.md'),
      this.destinationPath(
        `${this.dirExamples}/${this.answers.initialModule}/README.md`
      ),
      { module: this.answers.initialModule }
    );
  }

  private _ensureArray(possibleArray: any) {
    if (possibleArray instanceof Array) {
      return possibleArray;
    }

    return possibleArray.split(',').map((e: string) => e.trim());
  }

  private async _getAnswers() {
    return this.prompt([
      {
        choices: this.providers,
        default: 'aws',
        message: 'Provider',
        name: 'provider',
        type: 'list',
      },
      {
        default: this.regionDefault,
        message: 'Region',
        name: 'region',
        type: 'input',
      },
      {
        default: this.envListDefault,
        message: 'Environments (comma separated)',
        name: 'environments',
        type: 'input',
      },
      {
        default: this.stateBucketDefault,
        message: 'Backend state bucket',
        name: 'stateBucket',
        type: 'input',
      },
      {
        default: this.stateKeyDefault,
        message: 'Backend state key',
        name: 'stateKey',
        type: 'input',
      },
      {
        default: this.lockTableDefault,
        message: 'Backend lock table',
        name: 'lockTable',
        type: 'input',
      },
      {
        default: this.initialModuleDefault,
        message: 'Initial module name',
        name: 'initialModule',
        type: 'input',
      },
    ]);
  }
}
