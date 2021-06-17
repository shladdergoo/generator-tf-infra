module "vpc-<%= project %>" {
  source              = "./modules/vpc"
  region              = var.region
  label               = "<%= project %>"
  vpc_name            = "${var.env}-<%= project %>-vpc"
  vpc_description     = "Host VPC for <%= project %>"
  vpc_cidr            = var.vpc_cidr
  vpc_private_subnets = var.vpc_private_subnets
  vpc_public_subnets  = var.vpc_public_subnets
  vpc_azs             = var.vpc_azs
  tags                = var.tags
}
