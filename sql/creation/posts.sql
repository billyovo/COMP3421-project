CREATE TABLE posts (
    category INT FOREIGN KEY REFERENCES dbo.category(id),
    title VARCHAR(100),
	authorID INT FOREIGN KEY REFERENCES dbo.users(userID),
	postID INT IDENTITY(1,1) PRIMARY KEY,
);

