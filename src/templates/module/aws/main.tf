locals {
  label = var.label
}

module "vpc" {
  create_vpc = var.enable
  source     = "terraform-aws-modules/vpc/aws"
  version    = "2.70.0"

  name                  = var.vpc_name
  cidr                  = var.vpc_cidr
  secondary_cidr_blocks = var.secondary_cidr_blocks

  azs             = var.vpc_azs
  private_subnets = var.vpc_private_subnets
  public_subnets  = var.vpc_public_subnets

  enable_dns_hostnames = var.vpc_enable_dns_hostnames
  enable_dns_support   = var.vpc_enable_dns_support
  enable_nat_gateway   = var.vpc_enable_nat_gateway
  single_nat_gateway   = var.single_nat_gateway
  external_nat_ip_ids  = var.external_nat_ip_ids
  reuse_nat_ips        = length(var.external_nat_ip_ids) > 0
  public_subnet_tags   = var.public_subnet_tags
  private_subnet_tags  = var.private_subnet_tags
  tags                 = var.tags
}

resource "aws_vpc_endpoint" "vpce-gateways" {
  count           = var.enable ? length(var.vpc_gateway_endpoint_services) : 0
  vpc_id          = module.vpc.vpc_id
  service_name    = "com.amazonaws.${var.region}.${var.vpc_gateway_endpoint_services[count.index]}"
  route_table_ids = module.vpc.private_route_table_ids
  tags            = var.tags
}
