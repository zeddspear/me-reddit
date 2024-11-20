import { Migration } from "@mikro-orm/migrations";

export class Migration20241026081304 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "post" ("id" serial primary key, "created_at" date not null, "updated_at" date not null, "title" text not null);`
    );

    this.addSql(`alter table "user" add column "password" text not null;`);
    this.addSql(`alter table "user" rename column "title" to "username";`);
    this.addSql(
      `alter table "user" add constraint "user_username_unique" unique ("username");`
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "post" cascade;`);

    this.addSql(`alter table "user" drop constraint "user_username_unique";`);
    this.addSql(`alter table "user" drop column "password";`);

    this.addSql(`alter table "user" rename column "username" to "title";`);
  }
}
