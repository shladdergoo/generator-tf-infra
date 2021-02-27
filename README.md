[![npm](https://img.shields.io/npm/v/generator-tf-infra)](https://www.npmjs.com/package/generator-tf-infra)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/shladdergoo/generator-tf-infra/Node.js%20CI)

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
```

***NOTE:** This template will generate files in the **current directory**, so be sure to always run it against the correct directory.*

## Terraform Operations
The tasks `plan`, `apply` and `destroy` are defined in the generated `Makefile`
```
export AWS_PROFILE=dev_profile
ENV=dev make apply
```
Where `dev` is one of the environment names supplied when running the generator and `dev_profile` is a named profile in the user's `.aws/credentials` [file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

In this case the infrastructure defined by the project is applied using the variables defined in
```
environments/dev/variables.tf
```
