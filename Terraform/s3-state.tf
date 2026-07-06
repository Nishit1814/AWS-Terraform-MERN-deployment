resource "aws_s3_bucket" "my-state" {
    bucket = "my-state-bucket-1411"

    tags = {
      Name = "Statefile"
      Environment = "Dev"
    }
    
}
