output "id" {
  value       = module.vpc.vpc_id
  description = "The ID of the VPC"
}

output "label" {
  value       = local.label
  description = "A readable label given to the VPC and potentially other resources asscoiated with it"
}

output "public_subnet_cidrs" {
  value       = module.vpc.public_subnets_cidr_blocks
  description = "List of the CIDR block for the public subnets within the VPC"
}

output "private_subnet_cidrs" {
  value       = module.vpc.private_subnets_cidr_blocks
  description = "List of the CIDR block for the private subnets within the VPC"
}

output "public_subnet_ids" {
  value       = module.vpc.public_subnets
  description = "List of the IDs for the public subnets within the VPC"
}

output "private_subnet_ids" {
  value       = module.vpc.private_subnets
  description = "List of the IDs for the private subnets within the VPC"
}

output "private_route_table_ids" {
  value       = module.vpc.private_route_table_ids
  description = "List of the private routing table IDs within the VPC"
}

output "public_route_table_ids" {
  value       = module.vpc.public_route_table_ids
  description = "List of the Public routing table IDs within the VPC"
}
