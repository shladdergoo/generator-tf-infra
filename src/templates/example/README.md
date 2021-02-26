# VPC example

This folder contains a [Terraform](https://www.terraform.io/) configuration that shows an example of how to use the [<%= module %> module](../../modules/<%= module %>) to deploy a VPC in an [Amazon Web Services (AWS) 
account](http://aws.amazon.com/).

## Pre-requisites


## Quick start

Configure your [AWS access 
keys](http://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) as 
environment variables:

```
export AWS_ACCESS_KEY_ID=(your access key id)
export AWS_SECRET_ACCESS_KEY=(your secret access key)
```

Deploy the code:

```
terraform init
terraform apply
```

Clean up when you're done:

```
terraform destroy
```
