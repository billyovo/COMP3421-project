CREATE TABLE users (
    user_name varchar(30) NOT NULL UNIQUE,
    userID INTEGER IDENTITY(1,1) PRIMARY KEY,
	password_hash VARCHAR(64) NOT NULL,
	password_salt VARCHAR(8) NOT NULL
);