import * as ejs from 'ejs';
import { AppendOptions } from 'mem-fs-editor';
import * as Generator from 'yeoman-generator';
import yosay = require('yosay');

import { Defaults } from './defaults';
import { CloudProviderFactory } from './providers/cloudProviderFactory';

export default class extends Generator {
  private projectName = this.contextRoot.split('/').pop() ?? 'tf-proj';
  private answers: any;
  private templateData = new Map<string, any>();
  private provider = Defaults.providers[0].provider;

  public constructor(args: any, opts: any) {
    super(args, opts);

    this.option('precommit', {
      default: false,
      description: 'Install a pre-commit hook for formatting and validation',
      type: Boolean,
    });
    this.option('tests', {
      default: false,
      description: 'Generate tests for the (optional) sample module',
      type: Boolean,
    });
  }

  public initializing(): void {
    this.log(yosay('Woot!'));
  }

  public async prompting() {
    this.answers = await this._getAnswers();
    this.answers.environments = this._ensureArray(this.answers.environments);

    this.templateData = CloudProviderFactory.getProvider(
      this.provider,
      this.projectName
    ).GetTemplateData(this.answers);
  }

  public writing(): void {
    this.log('copying files');

    this._createStaticFiles();
    this._createReadme();
    this._createMakefile(this.provider);
    this._createEnvironments(this.provider);
    this._createMain(this.provider);
    if (this.answers.createSampleModule) {
      this._createSampleModule(this.provider);
      this._addModuleImplementation(this.provider);
      this._createExample(this.provider);
      if (this.options.tests) {
        this._createTests();
      }
    }
  }

  public install(): void {
    if (this.options.precommit) {
      this._addPrecommitHook();
    }

    if (this.options.tests) {
      if (!this.answers.createSampleModule) {
        this.log('sample module not generated, ignoring --tests');
        return;
      }
      this._initialiseTests();
    }
  }

  private _addPrecommitHook() {
    this._initGit();
    this._addHook();
    this._installHook();
    this._updateReadme();
    if (this.answers.createSampleModule) {
      this._createModuleReadmeForDocs();
    }
    this._stageGitChanges();
  }

  private _createStaticFiles(): void {
    Defaults.statciFiles.forEach(fileCopyTuple => {
      this.fs.copy(
        this.templatePath(fileCopyTuple[0]),
        this.destinationPath(fileCopyTuple[1])
      );
    });
  }

  private _createReadme() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { heading: this.projectName }
    );
  }

  private _createMakefile(provider: any) {
    this.fs.copy(
      this.templatePath(`make/${provider}/Makefile`),
      this.destinationPath('Makefile')
    );
  }

  private _createEnvironments(provider: string): void {
    this.answers.environments.forEach((env: string) => {
      this.fs.copyTpl(
        this.templatePath(`env/${provider}/backend.tfvars`),
        this.destinationPath(
          `${Defaults.dirEnvironments}/${env}/backend.tfvars`
        ),
        this.templateData.get(`backend_${env}`)
      );

      this.fs.copyTpl(
        this.templatePath(`env/${provider}/variables.tfvars`),
        this.destinationPath(
          `${Defaults.dirEnvironments}/${env}/variables.tfvars`
        ),
        this.templateData.get(`variable_${env}`)
      );
    });
  }

  private _createMain(provider: string): void {
    this.fs.copy(
      this.templatePath(`main/${provider}/${Defaults.fileMain}`),
      this.destinationPath(Defaults.fileMain)
    );

    this.fs.copyTpl(
      this.templatePath(`main/${provider}/${Defaults.fileVariables}`),
      this.destinationPath(Defaults.fileVariables),
      this.templateData.get('variable_main')
    );
  }

  private _createSampleModule(provider: string) {
    this.fs.copy(
      this.templatePath(`module/${provider}/${Defaults.fileMain}`),
      this.destinationPath(
        `${Defaults.dirModules}/${Defaults.sampleModuleName}/${Defaults.fileMain}`
      )
    );

    this.fs.copy(
      this.templatePath(`module/${provider}/${Defaults.fileVariables}`),
      this.destinationPath(
        `${Defaults.dirModules}/${Defaults.sampleModuleName}/${Defaults.fileVariables}`
      )
    );

    this.fs.copy(
      this.templatePath(`module/${provider}/${Defaults.fileOutputs}`),
      this.destinationPath(
        `${Defaults.dirModules}/${Defaults.sampleModuleName}/${Defaults.fileOutputs}`
      )
    );
  }

  private _addModuleImplementation(provider: string) {
    this._appendTpl(
      this.destinationPath(Defaults.fileVariables),
      this.fs.read(this.templatePath(`module/${provider}/root_variables.tf`)),
      this.templateData.get('variable_main'),
      undefined,
      { trimEnd: false }
    );

    this._appendTpl(
      this.destinationPath(Defaults.fileMain),
      this.fs.read(this.templatePath(`module/${provider}/root_main.tf`)),
      this.templateData.get('main_module'),
      undefined,
      { trimEnd: false }
    );
  }

  private _createExample(provider: string) {
    const exampleFiles = [
      Defaults.fileVariables,
      Defaults.fileDependencies,
      Defaults.fileOutputs,
    ];

    exampleFiles.forEach((filename: string) => {
      this.fs.copy(
        this.templatePath(`example/${provider}/${filename}`),
        this.destinationPath(
          `${Defaults.dirExamples}/${Defaults.sampleModuleName}/${filename}`
        )
      );
    });

    this.fs.copyTpl(
      this.templatePath(`example/${provider}/README.md`),
      this.destinationPath(
        `${Defaults.dirExamples}/${Defaults.sampleModuleName}/README.md`
      ),
      this.templateData.get('example_readme')
    );

    this.fs.copyTpl(
      this.templatePath(`example/${provider}/${Defaults.fileMain}`),
      this.destinationPath(
        `${Defaults.dirExamples}/${Defaults.sampleModuleName}/${Defaults.fileMain}`
      ),
      this.templateData.get('variable_main')
    );
  }

  private _createTests() {
    this.fs.copy(
      this.templatePath('test/vpc_test.go'),
      this.destinationPath(`${Defaults.dirTests}/vpc_test.go`)
    );

    this.fs.copy(
      this.templatePath('test/README.md'),
      this.destinationPath(`${Defaults.dirTests}/README.md`)
    );
  }

  private _initialiseTests() {
    this.spawnCommand('go', ['mod', 'init', `${this.projectName}.com/test`], {
      cwd: Defaults.dirTests,
    });
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
      this.destinationPath(`modules/${Defaults.sampleModuleName}/README.md`)
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
        choices: Defaults.providers.map(p => p.provider),
        default: this.provider,
        message: 'Provider',
        name: 'provider',
        type: 'list',
      },
    ]).then(providerAnswers => {
      this.provider = providerAnswers.provider;
      return this.prompt(
        CloudProviderFactory.getProvider(
          this.provider,
          this.projectName
        ).GetQuestions()
      );
    });
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
