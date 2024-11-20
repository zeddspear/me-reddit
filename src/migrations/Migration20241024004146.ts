import { Migration } from "@mikro-orm/migrations";

export class Migration20241024004146 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "created_at" date not null, "updated_at" date not null, "title" text not null);`
    );
  }
}
