CREATE TABLE reply (
    content TEXT NOT NULL,
	authorID INT FOREIGN KEY REFERENCES dbo.users(userID),
	postID INT FOREIGN KEY REFERENCES dbo.posts(postID),
	order_in_post INT NOT NULL,
	comment_count INT NOT NULL,
	vote_count INT NOT NULL,
	replyID INT IDENTITY(1,1),
	reply_to_order INT,
	created_at DATETIME,
	PRIMARY KEY(postID, order_in_post)
);