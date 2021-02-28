## Using Pre-Commit
See https://github.com/antonbabenko/pre-commit-terraform for full details.

Three hooks from the above repo have been enabled on this repo:

- `terraform_fmt` - Rewrites all Terraform configuration files to a canonical format.
- `terraform_validate_no_variables` - Validates all Terraform configuration files without checking whether all required variables were set.
- `terraform_docs` - Inserts input and output documentation into README.md.

### Running Manually
```bash
pre-commit run -a

Terraform fmt............................................................Passed
Terraform validate without variables.....................................Passed
Terraform docs...........................................................Passed
```
