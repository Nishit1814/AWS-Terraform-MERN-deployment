output "table_name" {
  value       = aws_dynamodb_table.mern_db.name
  description = "The name of the DynamoDB table"
}
