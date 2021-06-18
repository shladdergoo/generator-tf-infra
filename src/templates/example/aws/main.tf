terraform {
  required_version = ">= 0.13"
}

provider "aws" {
  region = "<%= region %>"
}

module "vpc" {
  source              = "../../modules/vpc"
  region              = "<%= region %>"
  label               = var.label
  vpc_name            = "example-vpc"
  vpc_description     = "Host VPC - example"
  vpc_cidr            = "172.30.0.0/16"
  vpc_private_subnets = ["172.30.0.0/19", "172.30.32.0/19"]
  vpc_public_subnets  = ["172.30.96.0/19", "172.30.128.0/19"]
  vpc_azs             = ["<%= region %>a", "<%= region %>b"]
  tags                = { environment = "example" }
}
