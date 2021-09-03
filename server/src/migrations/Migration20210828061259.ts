import { Migration } from '@mikro-orm/migrations';

export class Migration20210828061259 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "updated_at" timestamptz(0) not null, "created_at" timestamptz(0) not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
