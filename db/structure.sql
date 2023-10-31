CREATE TABLE admins (
    id int GENERATED ALWAYS AS IDENTITY,
    login varchar(64) UNIQUE NOT NULL,
    password_hash text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE news_images (
    id int GENERATED ALWAYS AS IDENTITY,
    image bytea NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE news (
    id int GENERATED ALWAYS AS IDENTITY,
    title varchar(128) NOT NULL,
    content text NOT NULL,
    publish_date timestamp with time zone NOT NULL,
    image_id int NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_news_images FOREIGN KEY (image_id) REFERENCES news_images(id)
);
