import * as ejs from 'ejs';
import { AppendOptions } from 'mem-fs-editor';
import * as Generator from 'yeoman-generator';
import yosay = require('yosay');

export default class extends Generator {
  private projectName = this.contextRoot.split('/').pop();
  private answers: any;
  private providers = ['aws'];
  private regionDefault = 'us-east-1';
  private envListDefault = ['dev', 'staging', 'prod'];
  private stateBucketDefault = 'terraform-state';
  private stateKeyDefault = 'terraform.tfstate';
  private lockTableDefault = 'terraform-locks';
  private sampleModuleDefault = false;
  private sampleModuleName = 'vpc';
  private dirEnvironments = 'environments';
  private dirModules = 'modules';
  private dirExamples = 'examples';
  private fileMain = 'main.tf';
  private fileVariables = 'variables.tf';
  private fileOutputs = 'outputs.tf';
  private fileDependencies = 'dependencies.tf';
  private statciFiles = [
    ['dotgitignore', '.gitignore'],
    ['dotgitattributes', '.gitattributes'],
    ['Makefile', 'Makefile'],
  ];

  public constructor(args: any, opts: any) {
    super(args, opts);

    this.option('precommit', { type: Boolean });
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

    this._copyStaticFiles();
    this._copyReadme();
    this._createEnvironments();
    this._createMain();
    if (this.answers.createSampleModule) {
      this._createSampleModule();
      this._addModuleImplementation();
      this._createExample();
    }
  }

  public install(): void {
    if (!this.options.precommit) {
      return;
    }

    this._initGit();
    this._addHook();
    this._installHook();
    this._updateReadme();
    if (this.answers.createSampleModule) {
      this._createModuleReadmeForDocs();
    }
    this._stageGitChanges();
  }

  private _copyStaticFiles(): void {
    this.statciFiles.forEach(fileCopyTuple => {
      this.fs.copy(
        this.templatePath(fileCopyTuple[0]),
        this.destinationPath(fileCopyTuple[1])
      );
    });
  }

  private _copyReadme() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { heading: this.projectName }
    );
  }

  private _createEnvironments(): void {
    this.answers.environments.forEach((env: string) => {
      this.fs.copyTpl(
        this.templatePath('env/backend.tfvars'),
        this.destinationPath(`${this.dirEnvironments}/${env}/backend.tfvars`),
        {
          bucket: this.answers.stateBucket,
          key: `${env}/${this.stateKeyDefault}`,
          region: this.answers.region,
          table: `${env}-${this.answers.lockTable}`,
        }
      );

      this.fs.copyTpl(
        this.templatePath(`env/variables.tfvars`),
        this.destinationPath(`${this.dirEnvironments}/${env}/variables.tfvars`),
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

  private _createSampleModule() {
    this.fs.copy(
      this.templatePath(`module/${this.fileMain}`),
      this.destinationPath(
        `${this.dirModules}/${this.sampleModuleName}/${this.fileMain}`
      )
    );

    this.fs.copy(
      this.templatePath(`module/${this.fileVariables}`),
      this.destinationPath(
        `${this.dirModules}/${this.sampleModuleName}/${this.fileVariables}`
      )
    );

    this.fs.copy(
      this.templatePath(`module/${this.fileOutputs}`),
      this.destinationPath(
        `${this.dirModules}/${this.sampleModuleName}/${this.fileOutputs}`
      )
    );
  }

  private _addModuleImplementation() {
    this._appendTpl(
      this.destinationPath(this.fileVariables),
      this.fs.read(this.templatePath('module/root_variables.tf')),
      { region: this.answers.region },
      undefined,
      { trimEnd: false }
    );

    this._appendTpl(
      this.destinationPath(this.fileMain),
      this.fs.read(this.templatePath('module/root_main.tf')),
      { project: this.projectName },
      undefined,
      { trimEnd: false }
    );
  }

  private _createExample() {
    const exampleFiles = [
      this.fileVariables,
      this.fileDependencies,
      this.fileOutputs,
    ];

    exampleFiles.forEach((filename: string) => {
      this.fs.copy(
        this.templatePath(`example/${filename}`),
        this.destinationPath(
          `${this.dirExamples}/${this.sampleModuleName}/${filename}`
        )
      );
    });

    this.fs.copyTpl(
      this.templatePath('example/README.md'),
      this.destinationPath(
        `${this.dirExamples}/${this.sampleModuleName}/README.md`
      ),
      { module: this.sampleModuleName, env: this.answers.environments[0] }
    );

    this.fs.copyTpl(
      this.templatePath(`example/${this.fileMain}`),
      this.destinationPath(
        `${this.dirExamples}/${this.sampleModuleName}/${this.fileMain}`
      ),
      { provider: this.answers.provider, region: this.answers.region }
    );
  }

  private _initGit(): void {
    this.log('initializing git repo');

    this.spawnCommandSync('git', ['init']);
  }

  private _addHook() {
    this.fs.copy(
      this.templatePath('precommit/dotpre-commit-config.yaml'),
      this.destinationPath('.pre-commit-config.yaml')
    );
  }

  private _installHook() {
    this.spawnCommand('pre-commit', ['install']);
  }

  private _updateReadme() {
    this.env.sharedFs.get(this.destinationPath('README.md')).conflicter =
      'force';
    this.fs.append(
      this.destinationPath('README.md'),
      this.fs.read(this.templatePath('precommit/root_README.md')),
      { trimEnd: false }
    );
  }

  private _createModuleReadmeForDocs() {
    this.fs.copy(
      this.templatePath('precommit/README.md'),
      this.destinationPath(`modules/${this.sampleModuleName}/README.md`)
    );
  }

  private _stageGitChanges() {
    this.log('staging changes');

    this.spawnCommand('git', ['add', '.']);
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
        default: this.sampleModuleDefault,
        message: 'Create sample module (VPC)?',
        name: 'createSampleModule',
        type: 'confirm',
      },
    ]);
  }

  private _appendTpl(
    filepath: string,
    contents: string,
    context?: ejs.Data | undefined,
    tplSettings?: ejs.Options | undefined,
    options?: AppendOptions | undefined
  ): void {
    if (context === undefined) {
      context = {};
    }
    if (tplSettings === undefined) {
      tplSettings = {};
    }

    const renderedContents = ejs
      .render(contents.toString(), context, tplSettings)
      .toString();

    this.fs.append(filepath, renderedContents, options);
  }
}
