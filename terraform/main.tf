terraform {
  backend "s3" {
    bucket = "shiftpsh-tfstate"
    key    = "tools.shiftpsh.com/state.tfstate"
    region = "ap-northeast-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.88"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}
