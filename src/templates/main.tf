terraform {
  required_version = ">= 0.13"
  backend "s3" {}
}

provider "<%= provider %>" {
  region = var.region
}
