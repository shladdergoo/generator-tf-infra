variable "enable" {
  description = "Controls if VPC should be created (it affects all resources)"
  type        = bool
  default     = true
}

variable "region" {
  description = "AWS region where the stack will be deployed."
}

variable "label" {
  description = "A readable label given to the VPC and potentially other resources asscoiated with it"
}

variable "vpc_cidr" {
  description = "The CIDR block of the VPC"
}

variable "secondary_cidr_blocks" {
  description = "The secondary CIDR block of the VPC"
  type        = list(string)
  default     = []
}

variable "vpc_name" {
  description = "The name of the VPC"
}

variable "vpc_description" {
  description = "Description for the tagging purposes"
}

variable "vpc_azs" {
  type        = list(string)
  description = "List of the AWS availability zones where the subnets will take place."
}

variable "vpc_private_subnets" {
  type        = list(string)
  description = "List of the CIDR block for the private subnets within the VPC"
}

variable "vpc_public_subnets" {
  type        = list(string)
  description = "List of the CIDR block for the public subnets within the VPC"
}

variable "vpc_enable_dns_hostnames" {
  type        = string
  default     = true
  description = "A boolean flag to enable/disable DNS hostnames in the VPC."
}

variable "vpc_enable_dns_support" {
  type        = string
  default     = true
  description = "A boolean flag to enable/disable DNS support in the VPC."
}

variable "vpc_enable_nat_gateway" {
  type    = string
  default = false
}

variable "single_nat_gateway" {
  type        = string
  default     = false
  description = "Set it to true if you need to create only one NAT gateway for the VPC"
}

variable "external_nat_ip_ids" {
  type        = list(string)
  default     = []
  description = "List of EIPs to reuse for NAT GW"
}

variable "public_subnet_tags" {
  default     = {}
  description = "Additional tags for the public subnets"
  type        = map(string)
}

variable "private_subnet_tags" {
  default     = {}
  description = "Additional tags for the private subnets"
  type        = map(string)
}

variable "vpc_gateway_endpoint_services" {
  type        = list(string)
  description = "List of AWS-managed VPC Endpoint Gateway services"
  default     = []
}

variable "vpc_interface_endpoint_services" {
  type        = list(string)
  description = "List of AWS-managed VPC Endpoint Interface services"
  default     = []
}

variable "vpc_endpoint_ingress_cidrs" {
  description = "List of ingress CIDRs for the VPC Endpoint Security Group"
  type        = list(string)
  default     = []
}

variable "vpc_enable_flow_log" {
  description = "Whether or not to enable VPC Flow Logs."
  default     = true
}

variable "vpc_transit_gateway_id" {
  type        = string
  description = "ID of Transit Gateway for AWS -> JS connectivity"
  default     = ""
}

variable "vpc_enable_tgw_static_routes" {
  description = "Enable static routes to RFC1918 routes on Transit Gateway for PRIVATE subnets"
  default     = true
}

variable "vpc_enable_tgw_static_public_routes" {
  description = "Enable static routes to RFC1918 routes on Transit Gateway for public subnet"
  default     = false
}

variable "tags" {
  type = map(any)
}
