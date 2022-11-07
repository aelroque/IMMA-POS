CREATE DATABASE immature;

CREATE TABLE user(user_id uuid DEFAULT uuid_generate_v4(),
username TEXT NOT NULL,
password TEXT NOT NULL,
PRIMARY KEY(user_id));

CREATE TABLE customer(c_id uuid DEFAULT uuid_generate_v4(),
cname TEXT NOT NULL,
caddress TEXT NOT NULL,
ccontact TEXT NOT NULL,
PRIMARY KEY(user_id));

CREATE TABLE supplier(sid uuid DEFAULT uuid_generate_v4(),
sbusname TEXT NOT NULL,
semail TEXT NOT NULL,
sphone TEXT NOT NULL,
ccontact TEXT NOT NULL,
srepname TEXT NOT NULL,
PRIMARY KEY(sid));

CREATE TABLE product(pid uuid DEFAULT uuid_generate_v4(),
pname TEXT NOT NULL,
qty TEXT NOT NULL,
uprice TEXT NOT NULL,
srp TEXT NOT NULL,
uom TEXT NOT NULL,
PRIMARY KEY(pid));

