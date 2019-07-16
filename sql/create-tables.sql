
CREATE TABLE IF NOT EXISTS Images (
    fileName VARCHAR(255) NOT NULL,
    date DATE,
    description TEXT,
    PRIMARY KEY (fileName)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Tags (
	tagId INT AUTO_INCREMENT,
    tag VARCHAR(255) NOT NULL,
    imageFileName VARCHAR(255) NOT NULL,
    PRIMARY KEY (tagId),
    FOREIGN KEY (imageFileName) REFERENCES Images(fileName)
);