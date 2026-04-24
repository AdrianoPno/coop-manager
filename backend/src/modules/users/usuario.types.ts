export type UserRole = "ADMIN" | "USER";

/**
 * @openapi
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [ADMIN, USER]
 *     IUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do documento no Firestore (geralmente o mesmo que o UID).
 *           readOnly: true
 *         uid:
 *           type: string
 *           description: UID do usuário vindo do Firebase Authentication.
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         unidadeId:
 *           type: string
 *           description: ID da unidade à qual o usuário pertence.
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         ativo:
 *           type: boolean
 */
export interface IUser {
  id?: string; // ID do documento no Firestore (mesmo que o UID)
  uid: string; // UID vindo do Firebase Auth
  nome: string;
  email: string;
  unidadeId: string; // Chave mestra para o isolamento multi-tenant
  role: UserRole;
  ativo: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ICreateUserDTO:
 *       type: object
 *       description: Dados para criação de um novo perfil de usuário. O campo 'unidadeId' é inferido do admin logado e não deve ser enviado.
 *       required:
 *         - uid
 *         - nome
 *         - email
 *         - role
 *       properties:
 *         uid:
 *           type: string
 *           description: UID gerado pelo Firebase Auth para o novo usuário.
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 */
/**
 * Data Transfer Object para criação de usuário.
 * Usado quando um ADMIN cadastra um novo colaborador no sistema.
 */
export interface ICreateUserDTO {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IUpdateUserDTO:
 *       type: object
 *       description: Dados para atualização de um usuário. Todos os campos são opcionais.
 *       properties:
 *         nome:
 *           type: string
 *         unidadeId:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         ativo:
 *           type: boolean
 */
/**
 * Data Transfer Object para atualização de perfil.
 */
export type IUpdateUserDTO = Partial<Omit<IUser, "id" | "uid" | "createdAt">>;
