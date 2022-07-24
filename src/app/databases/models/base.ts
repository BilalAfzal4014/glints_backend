import {Model} from "../sql-connection";

class BaseModel extends Model {
    public updated_at: Date | undefined;
    public created_at: Date | undefined;

    $beforeInsert() {
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    $beforeUpdate() {
        this.updated_at = new Date();
    }
}

export default BaseModel;