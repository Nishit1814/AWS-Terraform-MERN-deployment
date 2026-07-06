variable "table_name" {
  type        = string
  description = "The name of the DynamoDB table"
}

variable "hash_key_name" {
  type        = string
  default     = "userId" 
  description = "The primary key for the table"
}
