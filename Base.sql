-- -------------------------------------------------
-- Table des users
-- -------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

-- -------------------------------------------------
-- Table des documents
-- -------------------------------------------------
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(100) NOT NULL,
    type JSON,           
    data BYTEA          
);

-- -------------------------------------------------
-- Table des compétences
-- -------------------------------------------------
CREATE TABLE compétences (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(100) NOT NULL,
    type JSON,         
    data BYTEA   
);
