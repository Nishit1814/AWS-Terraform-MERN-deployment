resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "TF-state-Table"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  
  tags = {
    Name        = "dynamodb-state-lock"
  }
}
