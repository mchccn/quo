import { Token, TokenType } from "./main/Token";

export const getlast = (list: unknown) => (Array.isArray(list) ? list?.[list.length - 1] ?? null : list);

export const wraplexeme = (lexeme: string) => new Token(TokenType.Eof, lexeme, undefined, 1, 1);
