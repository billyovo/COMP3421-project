CREATE TABLE vote (
    replyID INT,
    userID INT FOREIGN KEY REFERENCES dbo.users(userID),
    voteType VARCHAR(7) NOT NULL CHECK (voteType IN ('like','dislike')),
	PRIMARY KEY(replyID, userID)
);
