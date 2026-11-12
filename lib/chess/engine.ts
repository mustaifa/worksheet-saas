/**
 * Chess rules: board state, legal move generation, check / checkmate / draw
 * detection and standard notation. No dependencies; verified with perft counts
 * (see scripts/verify-chess.ts).
 *
 * Squares are 0..63 with 0 = a8 and 63 = h1 (row 0 is rank 8).
 * A piece is `type | (color << 3)`; 0 is an empty square.
 */
export const WHITE = 0, BLACK = 1;
export const PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;
export const F_EP = 1, F_CASTLE = 2, F_DOUBLE = 4;

export type Move = { from: number; to: number; piece: number; captured: number; promo: number; flag: number };
export type Status = {
  over: boolean;
  check: boolean;
  /** WHITE or BLACK when someone won, otherwise null. */
  winner: number | null;
  reason: "checkmate" | "stalemate" | "fifty-move rule" | "threefold repetition" | "insufficient material" | null;
};

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const FEN_PIECES = " pnbrqk";
const LETTERS = ["", "", "N", "B", "R", "Q", "K"];
const KNIGHT_STEPS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KING_STEPS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const DIAGONALS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const STRAIGHTS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

// Castling rights: 1 = white king side, 2 = white queen side, 4 = black king side, 8 = black queen side.
const CASTLE_MASK = new Uint8Array(64).fill(15);
CASTLE_MASK[60] = 15 & ~3; CASTLE_MASK[63] = 15 & ~1; CASTLE_MASK[56] = 15 & ~2;
CASTLE_MASK[4] = 15 & ~12; CASTLE_MASK[7] = 15 & ~4; CASTLE_MASK[0] = 15 & ~8;

export const colorOf = (p: number) => p >> 3;
export const typeOf = (p: number) => p & 7;
export const squareName = (s: number) => "abcdefgh"[s & 7] + (8 - (s >> 3));

export class Chess {
  board = new Int8Array(64);
  turn = WHITE;
  castling = 15;
  ep = -1;
  half = 0;
  full = 1;
  kings = [60, 4];
  /** Moves played in this game, with their notation. */
  history: { move: Move; san: string }[] = [];
  /** Position keys after each move (index 0 is the starting position), for repetition. */
  keys: string[] = [];
  private undoStack: number[] = [];

  constructor(fen: string = START_FEN) { this.load(fen); }

  load(fen: string) {
    const [rows, turn, castle, ep, half, full] = fen.trim().split(/\s+/);
    this.board.fill(0);
    let s = 0;
    for (const ch of rows) {
      if (ch === "/") continue;
      if (ch >= "1" && ch <= "8") { s += Number(ch); continue; }
      const type = FEN_PIECES.indexOf(ch.toLowerCase());
      const color = ch === ch.toLowerCase() ? BLACK : WHITE;
      this.board[s] = type | (color << 3);
      if (type === KING) this.kings[color] = s;
      s++;
    }
    this.turn = turn === "b" ? BLACK : WHITE;
    this.castling = 0;
    if (castle && castle !== "-") {
      if (castle.includes("K")) this.castling |= 1;
      if (castle.includes("Q")) this.castling |= 2;
      if (castle.includes("k")) this.castling |= 4;
      if (castle.includes("q")) this.castling |= 8;
    }
    this.ep = ep && ep !== "-" ? (ep.charCodeAt(0) - 97) + (8 - Number(ep[1])) * 8 : -1;
    this.half = Number(half) || 0;
    this.full = Number(full) || 1;
    this.history = [];
    this.undoStack = [];
    this.keys = [this.key()];
  }

  /** Identifies a position for the repetition rule. */
  key(): string {
    return Array.from(this.board).join(",") + "|" + this.turn + "|" + this.castling + "|" + this.ep;
  }

  private addPawnMove(out: Move[], from: number, to: number, piece: number, captured: number, promoRow: number) {
    if ((to >> 3) === promoRow) {
      for (const promo of [QUEEN, ROOK, BISHOP, KNIGHT]) out.push({ from, to, piece, captured, promo, flag: 0 });
    } else out.push({ from, to, piece, captured, promo: 0, flag: 0 });
  }

  /** Moves that follow piece movement rules but may leave the mover's king in check. */
  pseudoMoves(capturesOnly = false): Move[] {
    const out: Move[] = [];
    const b = this.board, us = this.turn;
    for (let s = 0; s < 64; s++) {
      const p = b[s];
      if (!p || (p >> 3) !== us) continue;
      const t = p & 7, r = s >> 3, c = s & 7;
      if (t === PAWN) {
        const dir = us === WHITE ? -8 : 8, startRow = us === WHITE ? 6 : 1, promoRow = us === WHITE ? 0 : 7;
        const f = s + dir;
        if (b[f] === 0 && (!capturesOnly || (f >> 3) === promoRow)) {
          this.addPawnMove(out, s, f, p, 0, promoRow);
          if (!capturesOnly && r === startRow && b[f + dir] === 0) out.push({ from: s, to: f + dir, piece: p, captured: 0, promo: 0, flag: F_DOUBLE });
        }
        for (let dc = -1; dc <= 1; dc += 2) {
          const cc = c + dc;
          if (cc < 0 || cc > 7) continue;
          const to = f + dc, q = b[to];
          if (q && (q >> 3) !== us) this.addPawnMove(out, s, to, p, q, promoRow);
          else if (!q && to === this.ep) out.push({ from: s, to, piece: p, captured: PAWN | ((1 - us) << 3), promo: 0, flag: F_EP });
        }
      } else if (t === KNIGHT || t === KING) {
        const steps = t === KNIGHT ? KNIGHT_STEPS : KING_STEPS;
        for (const [dr, dc] of steps) {
          const rr = r + dr, cc = c + dc;
          if (rr < 0 || rr > 7 || cc < 0 || cc > 7) continue;
          const to = rr * 8 + cc, q = b[to];
          if (!q) { if (!capturesOnly) out.push({ from: s, to, piece: p, captured: 0, promo: 0, flag: 0 }); }
          else if ((q >> 3) !== us) out.push({ from: s, to, piece: p, captured: q, promo: 0, flag: 0 });
        }
        if (t === KING && !capturesOnly) this.addCastling(out, s, p);
      } else {
        const dirs = t === BISHOP ? DIAGONALS : t === ROOK ? STRAIGHTS : KING_STEPS;
        for (const [dr, dc] of dirs) {
          let rr = r + dr, cc = c + dc;
          while (rr >= 0 && rr <= 7 && cc >= 0 && cc <= 7) {
            const to = rr * 8 + cc, q = b[to];
            if (!q) { if (!capturesOnly) out.push({ from: s, to, piece: p, captured: 0, promo: 0, flag: 0 }); }
            else { if ((q >> 3) !== us) out.push({ from: s, to, piece: p, captured: q, promo: 0, flag: 0 }); break; }
            rr += dr; cc += dc;
          }
        }
      }
    }
    return out;
  }

  private addCastling(out: Move[], s: number, p: number) {
    const b = this.board, us = this.turn, them = 1 - us;
    const home = us === WHITE ? 60 : 4, rook = ROOK | (us << 3);
    if (s !== home) return;
    const kingSide = us === WHITE ? 1 : 4, queenSide = us === WHITE ? 2 : 8;
    if ((this.castling & kingSide) && b[home + 1] === 0 && b[home + 2] === 0 && b[home + 3] === rook &&
        !this.attacked(home, them) && !this.attacked(home + 1, them) && !this.attacked(home + 2, them)) {
      out.push({ from: s, to: home + 2, piece: p, captured: 0, promo: 0, flag: F_CASTLE });
    }
    if ((this.castling & queenSide) && b[home - 1] === 0 && b[home - 2] === 0 && b[home - 3] === 0 && b[home - 4] === rook &&
        !this.attacked(home, them) && !this.attacked(home - 1, them) && !this.attacked(home - 2, them)) {
      out.push({ from: s, to: home - 2, piece: p, captured: 0, promo: 0, flag: F_CASTLE });
    }
  }

  /** Is square `sq` attacked by any piece of color `by`? */
  attacked(sq: number, by: number): boolean {
    const b = this.board, r = sq >> 3, c = sq & 7;
    const pawnRow = by === WHITE ? r + 1 : r - 1, pawn = PAWN | (by << 3);
    if (pawnRow >= 0 && pawnRow <= 7) {
      if (c > 0 && b[pawnRow * 8 + c - 1] === pawn) return true;
      if (c < 7 && b[pawnRow * 8 + c + 1] === pawn) return true;
    }
    const knight = KNIGHT | (by << 3), king = KING | (by << 3);
    for (const [dr, dc] of KNIGHT_STEPS) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr <= 7 && cc >= 0 && cc <= 7 && b[rr * 8 + cc] === knight) return true;
    }
    for (const [dr, dc] of KING_STEPS) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr <= 7 && cc >= 0 && cc <= 7 && b[rr * 8 + cc] === king) return true;
    }
    const bishop = BISHOP | (by << 3), rook = ROOK | (by << 3), queen = QUEEN | (by << 3);
    for (const [dr, dc] of DIAGONALS) {
      let rr = r + dr, cc = c + dc;
      while (rr >= 0 && rr <= 7 && cc >= 0 && cc <= 7) {
        const q = b[rr * 8 + cc];
        if (q) { if (q === bishop || q === queen) return true; break; }
        rr += dr; cc += dc;
      }
    }
    for (const [dr, dc] of STRAIGHTS) {
      let rr = r + dr, cc = c + dc;
      while (rr >= 0 && rr <= 7 && cc >= 0 && cc <= 7) {
        const q = b[rr * 8 + cc];
        if (q) { if (q === rook || q === queen) return true; break; }
        rr += dr; cc += dc;
      }
    }
    return false;
  }

  inCheck(color: number = this.turn): boolean { return this.attacked(this.kings[color], 1 - color); }

  /** Plays a move on the board (no legality check, no notation). Pair with unmake(). */
  make(m: Move) {
    const b = this.board, us = this.turn;
    this.undoStack.push(this.castling, this.ep, this.half);
    b[m.from] = 0;
    if (m.flag === F_EP) b[m.to + (us === WHITE ? 8 : -8)] = 0;
    b[m.to] = m.promo ? m.promo | (us << 3) : m.piece;
    if ((m.piece & 7) === KING) {
      this.kings[us] = m.to;
      if (m.flag === F_CASTLE) {
        const rook = ROOK | (us << 3);
        if (m.to > m.from) { b[m.to + 1] = 0; b[m.to - 1] = rook; } else { b[m.to - 2] = 0; b[m.to + 1] = rook; }
      }
    }
    this.ep = m.flag === F_DOUBLE ? (m.from + m.to) >> 1 : -1;
    this.castling &= CASTLE_MASK[m.from] & CASTLE_MASK[m.to];
    this.half = (m.piece & 7) === PAWN || m.captured ? 0 : this.half + 1;
    if (us === BLACK) this.full++;
    this.turn = 1 - us;
  }

  unmake(m: Move) {
    const b = this.board, us = 1 - this.turn;
    this.turn = us;
    if (us === BLACK) this.full--;
    this.half = this.undoStack.pop() as number;
    this.ep = this.undoStack.pop() as number;
    this.castling = this.undoStack.pop() as number;
    b[m.from] = m.piece;
    if (m.flag === F_EP) { b[m.to] = 0; b[m.to + (us === WHITE ? 8 : -8)] = m.captured; }
    else b[m.to] = m.captured;
    if ((m.piece & 7) === KING) {
      this.kings[us] = m.from;
      if (m.flag === F_CASTLE) {
        const rook = ROOK | (us << 3);
        if (m.to > m.from) { b[m.to - 1] = 0; b[m.to + 1] = rook; } else { b[m.to + 1] = 0; b[m.to - 2] = rook; }
      }
    }
  }

  legalMoves(): Move[] {
    const us = this.turn, out: Move[] = [];
    for (const m of this.pseudoMoves()) {
      this.make(m);
      if (!this.attacked(this.kings[us], 1 - us)) out.push(m);
      this.unmake(m);
    }
    return out;
  }

  /** Standard algebraic notation for a legal move in the current position. */
  san(m: Move, legal: Move[] = this.legalMoves()): string {
    let s = "";
    const t = m.piece & 7;
    if (m.flag === F_CASTLE) s = m.to > m.from ? "O-O" : "O-O-O";
    else if (t === PAWN) {
      if (m.captured) s += squareName(m.from)[0] + "x";
      s += squareName(m.to);
      if (m.promo) s += "=" + LETTERS[m.promo];
    } else {
      s += LETTERS[t];
      const rivals = legal.filter((o) => o.piece === m.piece && o.to === m.to && o.from !== m.from);
      if (rivals.length) {
        const name = squareName(m.from);
        if (rivals.every((o) => (o.from & 7) !== (m.from & 7))) s += name[0];
        else if (rivals.every((o) => (o.from >> 3) !== (m.from >> 3))) s += name[1];
        else s += name;
      }
      if (m.captured) s += "x";
      s += squareName(m.to);
    }
    this.make(m);
    if (this.inCheck()) s += this.legalMoves().length === 0 ? "#" : "+";
    this.unmake(m);
    return s;
  }

  /** Plays a legal move in the game and records it. */
  move(m: Move) {
    const san = this.san(m);
    this.make(m);
    this.history.push({ move: m, san });
    this.keys.push(this.key());
  }

  /** Takes back the last move of the game. Returns false if there is none. */
  undo(): boolean {
    const last = this.history.pop();
    if (!last) return false;
    this.unmake(last.move);
    this.keys.pop();
    return true;
  }

  /** Finds the legal move between two squares (promo is needed only for promotions). */
  find(from: number, to: number, promo = 0): Move | undefined {
    return this.legalMoves().find((m) => m.from === from && m.to === to && (m.promo === promo || (!m.promo && !promo)));
  }

  insufficientMaterial(): boolean {
    let minors = 0;
    for (let s = 0; s < 64; s++) {
      const t = this.board[s] & 7;
      if (t === PAWN || t === ROOK || t === QUEEN) return false;
      if (t === KNIGHT || t === BISHOP) minors++;
    }
    return minors <= 1;
  }

  status(): Status {
    const check = this.inCheck();
    if (this.legalMoves().length === 0) {
      return check ? { over: true, check, winner: 1 - this.turn, reason: "checkmate" } : { over: true, check, winner: null, reason: "stalemate" };
    }
    if (this.insufficientMaterial()) return { over: true, check, winner: null, reason: "insufficient material" };
    if (this.half >= 100) return { over: true, check, winner: null, reason: "fifty-move rule" };
    const now = this.keys[this.keys.length - 1];
    if (this.keys.filter((k) => k === now).length >= 3) return { over: true, check, winner: null, reason: "threefold repetition" };
    return { over: false, check, winner: null, reason: null };
  }

  /** Counts positions reachable in `depth` moves; used to verify the rules. */
  perft(depth: number): number {
    if (depth === 0) return 1;
    const us = this.turn;
    let n = 0;
    for (const m of this.pseudoMoves()) {
      this.make(m);
      if (!this.attacked(this.kings[us], 1 - us)) n += depth === 1 ? 1 : this.perft(depth - 1);
      this.unmake(m);
    }
    return n;
  }
}
