create type tags as enum ('Sloth', 'Lust', 'Wrath', 'Envy', 'Pride', 'Gluttony', 'Greed');

create extension cube;
create extension earthdistance;

create table users
(
	user_id uuid not null
		constraint users_pkey
			primary key,
	username varchar(50) not null
		constraint users_username_key
			unique,
	password varchar(255) not null,
	email varchar(355) not null,
	verification_token uuid not null
		constraint users_verification_token_key
			unique,
	verified boolean default false,
	first_name varchar(50),
	last_name varchar(50),
	account_completed boolean default false not null,
	gender varchar(10),
	sexual_orientation varchar(10),
	bio varchar(255),
	tags tags[],
	picture_init boolean default false not null,
	connected boolean default false not null,
	timestamp timestamp default now() not null,
	age integer default 18 not null,
	blocked text[] default ARRAY[]::character varying[] not null,
	popularity_score double precision default 0 not null
);

create table likes
(
	user_id uuid not null,
	liked_user_id uuid not null,
	timestamp timestamp default now() not null
);

create table visits
(
	visitor_user_id uuid not null,
	visited_user_id uuid not null,
	date timestamp default now()
);

create table notifications
(
	user_id uuid not null,
	trigger_user_id uuid not null,
	message text not null,
	creation_date timestamp default now() not null
);

create table messages
(
	sender varchar(50) not null,
	receiver varchar(50) not null,
	message text not null,
	date timestamp default now() not null,
	room_id uuid not null,
	message_id uuid not null
);

create table geolocation
(
	user_id uuid not null,
	lat double precision default 45.739348 not null,
	lng double precision default 4.817550 not null
);

create table pictures
(
	picture_id uuid not null,
	user_id uuid not null,
	"primary" boolean not null,
	creation_date timestamp default now() not null,
	picture bytea not null
);

create table rooms
(
	room_id uuid not null,
	first_user uuid not null,
	second_user uuid not null
);

create unique index rooms_room_id_uindex
	on rooms (room_id);

