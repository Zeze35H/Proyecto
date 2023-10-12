--
-- File generated with SQLiteStudio v3.2.1 on Thu Oct 12 18:30:43 2023
--
-- Text encoding used: TIS-620
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: roles
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id        INTEGER PRIMARY KEY
                      NOT NULL,
    role_name VARCHAR,
    CHECK (id = 1 AND 
           role_name = 'estudiante' OR 
           id = 2 AND 
           role_name = 'profesor') 
);

INSERT INTO roles (
                      id,
                      role_name
                  )
                  VALUES (
                      1,
                      'estudiante'
                  );

INSERT INTO roles (
                      id,
                      role_name
                  )
                  VALUES (
                      2,
                      'profesor'
                  );


-- Table: session
DROP TABLE IF EXISTS session;

CREATE TABLE session (
    id        INTEGER PRIMARY KEY,
    id_user   INTEGER REFERENCES users (id),
    signed_in INTEGER
);


-- Table: students_teachers_relation
DROP TABLE IF EXISTS students_teachers_relation;

CREATE TABLE students_teachers_relation (
    id                    PRIMARY KEY,
    id_student    INTEGER REFERENCES users (id),
    [id_teacher ] INTEGER REFERENCES users (id),
    id_subject    INTEGER REFERENCES subjects (id) 
);


-- Table: subjects
DROP TABLE IF EXISTS subjects;

CREATE TABLE subjects (
    id   INTEGER PRIMARY KEY,
    name VARCHAR
);


-- Table: users
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id             INTEGER PRIMARY KEY AUTOINCREMENT
                           NOT NULL,
    username       VARCHAR UNIQUE,
    name           VARCHAR,
    surenames      VARCHAR,
    email          VARCHAR,
    role           INTEGER REFERENCES roles (id),
    access_token   VARCHAR,
    password_token VARCHAR,
    active         BOOLEAN DEFAULT (False) 
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
