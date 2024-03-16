import { database } from "../database";
import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  birth: Date;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface UserCreationAttributes extends Optional<User, "id"> {}

export interface UserInstance extends Model<User, UserCreationAttributes>, User {}

export const User = database.define<UserInstance, User>(
  "User",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    birth: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [["admin", "user"]],
      },
    },
  },
  {
    //hooks permitem que a gente agreguem um comportamento em um momento específico do ciclo de vida do model do sequelize
    hooks: {
      //hook executado antes de um registro ser salvo no banco
      //funciona tanto para salvar um novo registro quanto um registro que foi atualizado
      beforeSave: async (user) => {
        //isNewRecord = prop. do sequelize retorna verdadeiro se a instância não estiver salva no banco de dados
        //changed = verfica se a prop. mudou de valor
        if (user.isNewRecord || user.changed("password")) {
          //hash = cria uma hash pra senha (criptografar a senha no banco de dados )
          user.password = await bcrypt.hash(user.password.toString(), 10);
        }
      },
    },
  }
);
