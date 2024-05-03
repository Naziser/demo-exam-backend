# demo-exam-backend

drop table users cascade;

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

TRUNCATE TABLE users RESTART IDENTITY CASCADE;

TRUNCATE TABLE statements RESTART IDENTITY CASCADE;

-- SELECT users.id, users.password, ARRAY_AGG(roles.value) AS roles
--      FROM users
--      LEFT JOIN user_roles ON users.id = user_roles.user_id
--      LEFT JOIN roles ON user_roles.role_id = roles.id
--      WHERE users.username = 'Naziser'
--      GROUP BY users.id;
