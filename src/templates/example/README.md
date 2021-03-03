# VPC example

This folder contains a [Terraform](https://www.terraform.io/) configuration that shows an example of how to use the [<%= module %> module](../../modules/<%= module %>) to deploy a VPC in an [Amazon Web Services (AWS) 
account](http://aws.amazon.com/).

## Pre-requisites


## Quick start

Configure your [credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)


Deploy the code:

```
export AWS_PROFILE=<%= env %>_profile

ENV=<%= env %> make init
ENV=<%= env %> make apply
```

Clean up when you're done:

```
ENV=<%= env %> make destroy
```
