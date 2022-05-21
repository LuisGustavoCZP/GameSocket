CREATE TABLE public.user (
	"id" serial NOT NULL,
	"username" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"last_character" integer,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.character (
	"id" serial NOT NULL,
	"owner" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"points" real NOT NULL,
	CONSTRAINT "character_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "user" ADD CONSTRAINT "user_fk0" FOREIGN KEY ("last_character") REFERENCES "character"("id");

ALTER TABLE "character" ADD CONSTRAINT "character_fk0" FOREIGN KEY ("owner") REFERENCES "user"("id");



