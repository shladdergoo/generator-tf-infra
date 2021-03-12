<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| enable | Controls if VPC should be created (it affects all resources) | `bool` | `true` | no |
| external\_nat\_ip\_ids | List of EIPs to reuse for NAT GW | `list(string)` | `[]` | no |
| label | A readable label given to the VPC and potentially other resources asscoiated with it | `any` | n/a | yes |
| private\_subnet\_tags | Additional tags for the private subnets | `map(string)` | `{}` | no |
| public\_subnet\_tags | Additional tags for the public subnets | `map(string)` | `{}` | no |
| region | AWS region where the stack will be deployed. | `any` | n/a | yes |
| secondary\_cidr\_blocks | The secondary CIDR block of the VPC | `list(string)` | `[]` | no |
| single\_nat\_gateway | Set it to true if you need to create only one NAT gateway for the VPC | `string` | `false` | no |
| tags | n/a | `map(any)` | n/a | yes |
| vpc\_azs | List of the AWS availability zones where the subnets will take place. | `list(string)` | n/a | yes |
| vpc\_cidr | The CIDR block of the VPC | `any` | n/a | yes |
| vpc\_description | Description for the tagging purposes | `any` | n/a | yes |
| vpc\_enable\_dns\_hostnames | A boolean flag to enable/disable DNS hostnames in the VPC. | `string` | `true` | no |
| vpc\_enable\_dns\_support | A boolean flag to enable/disable DNS support in the VPC. | `string` | `true` | no |
| vpc\_enable\_flow\_log | Whether or not to enable VPC Flow Logs. | `bool` | `true` | no |
| vpc\_enable\_nat\_gateway | n/a | `string` | `false` | no |
| vpc\_enable\_tgw\_static\_public\_routes | Enable static routes to RFC1918 routes on Transit Gateway for public subnet | `bool` | `false` | no |
| vpc\_enable\_tgw\_static\_routes | Enable static routes to RFC1918 routes on Transit Gateway for PRIVATE subnets | `bool` | `true` | no |
| vpc\_endpoint\_ingress\_cidrs | List of ingress CIDRs for the VPC Endpoint Security Group | `list(string)` | `[]` | no |
| vpc\_gateway\_endpoint\_services | List of AWS-managed VPC Endpoint Gateway services | `list(string)` | `[]` | no |
| vpc\_interface\_endpoint\_services | List of AWS-managed VPC Endpoint Interface services | `list(string)` | `[]` | no |
| vpc\_name | The name of the VPC | `any` | n/a | yes |
| vpc\_private\_subnets | List of the CIDR block for the private subnets within the VPC | `list(string)` | n/a | yes |
| vpc\_public\_subnets | List of the CIDR block for the public subnets within the VPC | `list(string)` | n/a | yes |
| vpc\_transit\_gateway\_id | ID of Transit Gateway for AWS -> JS connectivity | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| id | The ID of the VPC |
| label | A readable label given to the VPC and potentially other resources asscoiated with it |
| private\_route\_table\_ids | List of the private routing table IDs within the VPC |
| private\_subnet\_cidrs | List of the CIDR block for the private subnets within the VPC |
| private\_subnet\_ids | List of the IDs for the private subnets within the VPC |
| public\_route\_table\_ids | List of the Public routing table IDs within the VPC |
| public\_subnet\_cidrs | List of the CIDR block for the public subnets within the VPC |
| public\_subnet\_ids | List of the IDs for the public subnets within the VPC |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
