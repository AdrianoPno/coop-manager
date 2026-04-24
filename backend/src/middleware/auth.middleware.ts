import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
    unidadeId?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);

    // Busca os dados complementares no Firestore para garantir permissão
    const userDoc = await getFirestore()
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      // É aqui que o 403 deve ser disparado se o usuário não tiver perfil no banco
      return res
        .status(403)
        .json({ error: "Usuário não autorizado ou perfil não encontrado" });
    }

    const userData = userDoc.data();

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData?.role,
      unidadeId: userData?.unidadeId,
    };

    next();
  } catch (error) {
    console.error("Erro na validação do token:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
