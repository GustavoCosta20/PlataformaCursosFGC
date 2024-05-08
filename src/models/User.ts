import { database } from "../database";
import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import { EpisodeInstance } from "./Episode";

type CheckPasswordCallback = (err?: Error, isSame?: boolean) => void;

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

export interface UserCreationAttributes extends Optional<User, "id"> { }

export interface UserInstance extends Model<User, UserCreationAttributes>, User {
  Episodes?: EpisodeInstance[]
  checkPassword: (password: string, callbackfn: CheckPasswordCallback) => void;
}

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
          user.password = await bcrypt.hash(user.password.toString(), 10);
        }
      },
    },
  }
);

declare module "sequelize" {
  interface Model {
    checkPassword(password: string, callbackfn: CheckPasswordCallback): void;
  }
}

User.prototype.checkPassword = async function (password: string, callbackfn: CheckPasswordCallback) {
  try {
    const user = this as UserInstance; // Informando ao TypeScript que 'this' é do tipo UserInstance
    const isSame = await bcrypt.compare(password, user.password);
    callbackfn(undefined, isSame);
  } catch (err) {
    callbackfn(err as Error); // Convertendo 'err' para 'Error'
  }
};
