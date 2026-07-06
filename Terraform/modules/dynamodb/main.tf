resource "aws_dynamodb_table" "mern_db" {
  name         = var.table_name   
  billing_mode = "PAY_PER_REQUEST"          
  hash_key     = var.hash_key_name                   #primary key

  attribute {
    name = "userID"
    type = "S"                              
  }
}
