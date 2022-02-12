export enum TokenType {
    BeginList,
    EndList,
    String,
    Number,
    True,
    False,
    Nil,
    Symbol,
    Eof,
}

export class Token {
    public constructor(
        public readonly type: TokenType,
        public readonly lexeme: string,
        public readonly literal: unknown,
        public readonly line: number,
        public readonly col: number
    ) {}
}
