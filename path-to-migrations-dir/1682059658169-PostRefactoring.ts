import { MigrationInterface, QueryRunner } from "typeorm"

export class PostRefactoring1682059658169 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE store_direction (
            id	bigint(20)	NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id	bigint(20)	NOT NULL,
            url	text	NULL)`
            
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
