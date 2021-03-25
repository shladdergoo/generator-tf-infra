[![npm](https://img.shields.io/npm/v/generator-tf-infra)](https://www.npmjs.com/package/generator-tf-infra)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/shladdergoo/generator-tf-infra/Node%20CICD)

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Yeoman Generator for Terraform Infrastructure Projects

`generator-tf-infra` is an opinionated generator for [Terraform](https://www.terraform.io/) infrastructure projects. *Currently only supports the [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs).*

Largely informed by [Terraform: Up & Running](https://www.terraformupandrunning.com/) but with an emphasis on 
infrastructure being defined once-only with only variables differing across environments.

Also prioritises executing operations from a single common entry point to aid inclusion in CI/CD pipelines and includes supporting tooling, as required.

## Prerequisites
1. Install latest [Node LTS](https://nodejs.org).
2. `npm install -g yo`
3. `npm install -g generator-tf-infra`

## Usage
```
$ yo tf-infra
$ yo tf-infra --help
```

***NOTE:** This template will generate files in the **current directory**, so be sure to always run it against the correct directory.*

## Terraform Operations
The tasks `plan`, `apply` and `destroy` are defined in the generated `Makefile`.
```
export AWS_PROFILE=dev_profile
ENV=dev make apply
```
Where `dev` is one of the environment names supplied when running the generator and `dev_profile` is a named profile in the user's `.aws/credentials` [file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

In this case the infrastructure defined by the project is applied using the variables defined in
```
environments/dev/variables.tfvars
```

## Pre-Commit Hook

Optionally, you can install [pre-commit hooks](https://github.com/antonbabenko/pre-commit-terraform) to validate terraform files, enforce consistent formatting and create module documentation.

### Prerequisites
Install the pre-commit package and the required dependencies

On MacOSX:

```
brew install pre-commit gawk terraform-docs tflint tfsec coreutils checkov
```
### Usage
Run `generator-tf-infra` with the `--precommit` option.
```
$ yo tf-infra --precommit
```
See `README.md` in the generated project for further details.

## Tests

Optionally, you can generate sample tests to accompany the sample module. These are built on the [terratest](https://terratest.gruntwork.io/) library and prove the correctness of the sample module in isolation of other infrastructure elements.

Tests heavily informed by (https://terratest.gruntwork.io/docs/getting-started/quick-start/#example-2-terraform-and-aws)

### Prerequisites
To use Terratest, you need to install:

[Go](https://golang.org/) (requires version >=1.13)

### Usage
Run `generator-tf-infra` with the `--tests` option (this can be combined with the `--precommit` option).
```
$ yo tf-infra --tests
```
Note: this option does nothing if you opt not to generate the sample module.
