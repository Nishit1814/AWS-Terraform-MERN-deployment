resource "aws_s3_bucket" "mern-db" {
    bucket = "mern-bucket-1411"

    tags = {
        Environment = var.environment
  }
}
