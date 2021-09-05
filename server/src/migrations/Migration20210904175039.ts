import { Migration } from '@mikro-orm/migrations';

export class Migration20210904175039 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "forgot_pass_token" varchar(255) null;');
  }

}
