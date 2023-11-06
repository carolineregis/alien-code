# Importing module 
import mysql.connector

# Creating connection object
mydb = mysql.connector.connect(
	host = "localhost",
	user = "postgres",
	password = "sweetG@tor"
)

# Printing the connection object 
print(mydb)
