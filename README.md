# demo-exam-backend

drop table users cascade;

TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE statements RESTART IDENTITY CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  login  VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT null,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255) unique,
  role VARCHAR(255) default 'USER'
);

CREATE TABLE statements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    vehicle_registration_number VARCHAR(255),
    violation_description TEXT,
    status VARCHAR(50) DEFAULT 'Pending'
);

INSERT INTO statements (user_id, vehicle_registration_number, violation_description, status) values
(2, 'A123BC', 'Неправильная парковка', 'Confirmed'),
(2, 'B456CD', 'Превышение скоростного режима', 'Pending');

----------------------------------------------------------------------------------------------------------

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    author_id INTEGER REFERENCES authors(id),
    genre_id INTEGER REFERENCES genres(id)
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user_groups (
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    PRIMARY KEY (user_id, group_id)
);

INSERT INTO authors (full_name) VALUES
('Leo Tolstoy'),
('Fyodor Dostoevsky');

INSERT INTO genres (name) VALUES
('Fiction'),
('Non-Fiction');

INSERT INTO books (title, type, author_id, genre_id) VALUES
('War and Peace', 'Hardcover', 1, 1),
('Crime and Punishment', 'Paperback', 2, 1);

INSERT INTO groups (name) VALUES
('Admins'),
('Regular Users');

INSERT INTO user_groups (user_id, group_id) VALUES
(2, 1),
(1, 2);

-- Присоединение книг к их авторам
SELECT b.title, b.type, a.full_name AS author
FROM books b
JOIN authors a ON b.author_id = a.id;

--Присоединение книг к их жанрам
SELECT b.title, g.name AS genre
FROM books b
JOIN genres g ON b.genre_id = g.id;

--Присоединение книг к их авторам и жанрам
SELECT b.title, b.type, a.full_name AS author, g.name AS genre
FROM books b
JOIN authors a ON b.author_id = a.id
JOIN genres g ON b.genre_id = g.id;

--Соединение пользователей с группами через промежуточную таблицу
SELECT u.full_name, u.email, g.name AS group_name
FROM users u
JOIN user_groups ug ON u.id = ug.user_id
JOIN groups g ON ug.group_id = g.id;

--Получение информации о пользователях с фильтрацией по роли и группе
SELECT u.full_name, u.role, g.name AS group_name
FROM users u
JOIN user_groups ug ON u.id = ug.user_id
JOIN groups g ON ug.group_id = g.id
WHERE u.role = 'ADMIN';

--Вывод пользователей и их данных без групп
SELECT u.full_name, u.email
FROM users u
LEFT JOIN user_groups ug ON u.id = ug.user_id
WHERE ug.group_id IS NULL;


INNER JOIN: Возвращает строки, когда есть соответствие в обеих таблицах.
LEFT JOIN (или LEFT OUTER JOIN): Возвращает все строки из левой таблицы и соответствующие строки из правой таблицы. Если соответствие отсутствует, результат будет содержать NULL на месте столбцов правой таблицы.
RIGHT JOIN (или RIGHT OUTER JOIN): Возвращает все строки из правой таблицы и соответствующие строки из левой таблицы. Если соответствие отсутствует, результат будет содержать NULL на месте столбцов левой таблицы.
FULL JOIN (или FULL OUTER JOIN): Возвращает строки, когда есть соответствие в одной из таблиц.

https://www.figma.com/file/bqA20bLfyDHinlsARtNSId/Untitled?type=design&mode=design&t=qktdV425XozLU16v-0
https://www.figma.com/file/bqA20bLfyDHinlsARtNSId/Untitled?type=design&mode=dev&t=qktdV425XozLU16v-1

https://www.figma.com/file/nIhMzZGHY50DmJyWiRTmkr/Project-%2F-SR-Data-2024?type=design&node-id=2-2&mode=design&t=9qCCPBILrHLgXrAk-0
https://www.figma.com/file/ozktUwPvRUGRS9rW6laUXD/Design-System-%2F-2024?type=design&node-id=0-1&mode=design&t=ojXUJHYApMDJHI5k-0
