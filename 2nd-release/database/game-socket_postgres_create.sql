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
	"name" varchar(100) NOT NULL UNIQUE,
	"x" real NOT NULL,
	"y" real NOT NULL,
	"points" real NOT NULL,
	CONSTRAINT "character_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "user" ADD CONSTRAINT "user_fk0" FOREIGN KEY ("last_character") REFERENCES "character"("id");

ALTER TABLE "character" ADD CONSTRAINT "character_fk0" FOREIGN KEY ("owner") REFERENCES "user"("id");


CREATE TABLE public.session (
	"id" uuid NOT NULL,
	"id_user" integer NOT NULL,
	"id_character" integer,
	"expire_time" TIMESTAMP NOT NULL,
	CONSTRAINT "session_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "session" ADD CONSTRAINT "session_fk0" FOREIGN KEY ("id_user") REFERENCES "user"("id");
ALTER TABLE "session" ADD CONSTRAINT "session_fk1" FOREIGN KEY ("id_character") REFERENCES "character"("id");
