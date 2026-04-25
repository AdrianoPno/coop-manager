import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Tipagem alinhada com as necessidades do Service e Controller
export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role: "SUPER" | "ADMIN" | "USER"; // Tipagem estrita
    unidadeId?: string;
    unidadeNome?: string;
    nome?: string;
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
    const db = getFirestore();

    // Busca dados do usuário
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res
        .status(403)
        .json({ error: "Perfil de usuário não encontrado" });
    }

    const userData = userDoc.data();
    let unidadeNome = userData?.unidadeNome; // Tenta pegar do cache do user primeiro

    // Se não tiver o nome no cache do user, busca na collection de unidades
    if (userData?.unidadeId && !unidadeNome) {
      const unidadeDoc = await db
        .collection("unidades")
        .doc(userData.unidadeId)
        .get();
      unidadeNome = unidadeDoc.data()?.nome;
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      nome: userData?.nome, // Adicionado para o Topbar
      role: userData?.role || "USER",
      unidadeId: userData?.unidadeId,
      unidadeNome: unidadeNome,
    };

    next();
  } catch (error) {
    console.error("🔥 [AUTH ERROR]:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
