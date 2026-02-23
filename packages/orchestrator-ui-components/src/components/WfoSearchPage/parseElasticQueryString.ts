import { Condition, Group } from '@/types';

/**
 * Parses an Elasticsearch query string query into the Group/Condition filter
 * structure used by the WfoSearchPage filter components.
 *
 * Supported syntax:
 *   field:value            → eq
 *   field:"exact phrase"   → eq
 *   field:value*           → like (wildcards: * → %, ? → _)
 *   field:>=value          → gte
 *   field:>value           → gt
 *   field:<=value          → lte
 *   field:<value           → lt
 *   field:[a TO b]         → between (inclusive)
 *   field:{a TO b}         → between (exclusive, approximated as inclusive)
 *   field:[* TO b]         → lte / lt
 *   field:[a TO *]         → gte / gt
 *   expr AND expr          → Group op:'AND'
 *   expr OR expr           → Group op:'OR'
 *   NOT expr / -field:x    → operator negated (eq→neq, gt→lte, etc.)
 *   (expr)                 → grouped expression
 *
 * Bare terms without a field name are ignored — pass them as the query text
 * to the search endpoint instead.
 *
 * Numeric strings are coerced to numbers, "true"/"false" to booleans.
 * The `between` value shape follows the DateRange type: { from, to }.
 */
export function parseElasticQueryString(queryString: string): Group | null {
    const trimmed = queryString.trim();
    if (!trimmed) return null;

    let result: Group | Condition | null;
    try {
        result = new Parser(tokenize(trimmed)).parse();
    } catch {
        return null;
    }

    if (result === null) return null;

    const compacted = compact(result);
    if (compacted === null) return null;

    // Always return a root Group so callers can spread children uniformly.
    if ('path' in compacted) {
        return { op: 'AND', children: [compacted] };
    }
    return compacted;
}

/* ─── Tokenizer ──────────────────────────────────────────────────────────────── */

type TokKind =
    | 'LPAREN'
    | 'RPAREN'
    | 'AND'
    | 'OR'
    | 'NOT'
    | 'MINUS'
    | 'COLON'
    | 'GTE'
    | 'GT'
    | 'LTE'
    | 'LT'
    | 'LBRACKET'
    | 'RBRACKET'
    | 'LCURLY'
    | 'RCURLY'
    | 'TO'
    | 'QUOTED'
    | 'WORD'
    | 'EOF';

interface Tok {
    kind: TokKind;
    value: string;
}

// Characters that end a word token (excluding '-' so hyphenated fields work).
const WORD_BREAK = /[\s()\[\]{}":!+|&<>=~^]/;

function tokenize(input: string): Tok[] {
    const tokens: Tok[] = [];
    let i = 0;
    const len = input.length;

    while (i < len) {
        if (/\s/.test(input[i])) {
            i++;
            continue;
        }

        const ch = input[i];

        // Quoted string
        if (ch === '"') {
            let j = i + 1;
            while (j < len && input[j] !== '"') {
                if (input[j] === '\\') j++; // skip escaped char
                j++;
            }
            tokens.push({ kind: 'QUOTED', value: input.slice(i + 1, j) });
            i = j + 1;
            continue;
        }

        // Single-char and multi-char punctuation
        if (ch === '(') {
            tokens.push({ kind: 'LPAREN', value: '(' });
            i++;
            continue;
        }
        if (ch === ')') {
            tokens.push({ kind: 'RPAREN', value: ')' });
            i++;
            continue;
        }
        if (ch === '[') {
            tokens.push({ kind: 'LBRACKET', value: '[' });
            i++;
            continue;
        }
        if (ch === ']') {
            tokens.push({ kind: 'RBRACKET', value: ']' });
            i++;
            continue;
        }
        if (ch === '{') {
            tokens.push({ kind: 'LCURLY', value: '{' });
            i++;
            continue;
        }
        if (ch === '}') {
            tokens.push({ kind: 'RCURLY', value: '}' });
            i++;
            continue;
        }
        if (ch === ':') {
            tokens.push({ kind: 'COLON', value: ':' });
            i++;
            continue;
        }
        if (ch === '!') {
            tokens.push({ kind: 'NOT', value: '!' });
            i++;
            continue;
        }
        if (ch === '+') {
            i++;
            continue;
        } // must-have prefix — treat as implicit AND

        if (ch === '&' && input[i + 1] === '&') {
            tokens.push({ kind: 'AND', value: '&&' });
            i += 2;
            continue;
        }
        if (ch === '|' && input[i + 1] === '|') {
            tokens.push({ kind: 'OR', value: '||' });
            i += 2;
            continue;
        }
        if (ch === '>' && input[i + 1] === '=') {
            tokens.push({ kind: 'GTE', value: '>=' });
            i += 2;
            continue;
        }
        if (ch === '>') {
            tokens.push({ kind: 'GT', value: '>' });
            i++;
            continue;
        }
        if (ch === '<' && input[i + 1] === '=') {
            tokens.push({ kind: 'LTE', value: '<=' });
            i += 2;
            continue;
        }
        if (ch === '<') {
            tokens.push({ kind: 'LT', value: '<' });
            i++;
            continue;
        }

        // Standalone '-' is a NOT prefix (negation of the next term).
        // Hyphens inside words are consumed by the word scanner below.
        if (ch === '-') {
            tokens.push({ kind: 'MINUS', value: '-' });
            i++;
            continue;
        }

        // Words: field names, values, keywords, wildcards.
        // The word scanner intentionally allows '-' so "my-field" stays one token;
        // a leading '-' is already handled above.
        if (!WORD_BREAK.test(ch)) {
            let j = i;
            while (j < len && !WORD_BREAK.test(input[j])) j++;
            const word = input.slice(i, j);
            if (word === 'AND') tokens.push({ kind: 'AND', value: word });
            else if (word === 'OR') tokens.push({ kind: 'OR', value: word });
            else if (word === 'NOT') tokens.push({ kind: 'NOT', value: word });
            else if (word === 'TO') tokens.push({ kind: 'TO', value: word });
            else tokens.push({ kind: 'WORD', value: word });
            i = j;
            continue;
        }

        i++; // skip any remaining character (e.g. ~, ^)
    }

    tokens.push({ kind: 'EOF', value: '' });
    return tokens;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

class Parser {
    private readonly tokens: Tok[];
    private pos = 0;

    constructor(tokens: Tok[]) {
        this.tokens = tokens;
    }

    private peek(): Tok {
        return this.tokens[this.pos];
    }

    private consume(): Tok {
        return this.tokens[this.pos++];
    }

    parse(): Group | Condition | null {
        if (this.peek().kind === 'EOF') return null;
        return this.parseOr();
    }

    // or_expr  := and_expr (OR and_expr)*
    private parseOr(): Group | Condition | null {
        let left = this.parseAnd();
        while (this.peek().kind === 'OR') {
            this.consume();
            const right = this.parseAnd();
            left = combine('OR', left, right);
        }
        return left;
    }

    // and_expr := not_expr ((AND | implicit) not_expr)*
    private parseAnd(): Group | Condition | null {
        let left = this.parseNot();
        while (this.peek().kind === 'AND' || this.isImplicitAnd()) {
            if (this.peek().kind === 'AND') this.consume();
            const right = this.parseNot();
            left = combine('AND', left, right);
        }
        return left;
    }

    // Implicit AND when the next token starts a new term but isn't a connector.
    private isImplicitAnd(): boolean {
        const k = this.peek().kind;
        return (
            k === 'LPAREN' ||
            k === 'NOT' ||
            k === 'MINUS' ||
            k === 'WORD' ||
            k === 'QUOTED'
        );
    }

    // not_expr := (NOT | MINUS) primary | primary
    private parseNot(): Group | Condition | null {
        if (this.peek().kind === 'NOT' || this.peek().kind === 'MINUS') {
            this.consume();
            const inner = this.parsePrimary();
            return inner === null ? null : negate(inner);
        }
        return this.parsePrimary();
    }

    // primary := LPAREN or_expr RPAREN | term
    private parsePrimary(): Group | Condition | null {
        if (this.peek().kind === 'LPAREN') {
            this.consume();
            const node = this.parseOr();
            if (this.peek().kind === 'RPAREN') this.consume();
            return node;
        }
        return this.parseTerm();
    }

    // term := WORD COLON field_value | bare_word (skipped)
    private parseTerm(): Group | Condition | null {
        const tok = this.peek();
        if (tok.kind !== 'WORD' && tok.kind !== 'QUOTED') return null;

        // field:value
        if (
            tok.kind === 'WORD' &&
            this.tokens[this.pos + 1]?.kind === 'COLON'
        ) {
            this.consume(); // field name
            this.consume(); // colon
            return this.parseFieldValue(tok.value);
        }

        // Bare term — cannot map to a Condition (no path), skip it.
        this.consume();
        return null;
    }

    // field_value := range | comparison | atom_value
    private parseFieldValue(field: string): Condition | null {
        const tok = this.peek();

        if (tok.kind === 'LBRACKET') return this.parseRange(field, true);
        if (tok.kind === 'LCURLY') return this.parseRange(field, false);

        if (
            tok.kind === 'GTE' ||
            tok.kind === 'GT' ||
            tok.kind === 'LTE' ||
            tok.kind === 'LT'
        ) {
            return this.parseComparison(field);
        }

        if (tok.kind === 'WORD' || tok.kind === 'QUOTED') {
            this.consume();
            return buildEqCondition(field, tok.value);
        }

        return null;
    }

    // range := ('[' | '{') bound TO bound (']' | '}')
    private parseRange(field: string, inclusive: boolean): Condition | null {
        this.consume(); // [ or {

        const from = this.parseRangeBound();

        if (this.peek().kind === 'TO') this.consume();

        const to = this.parseRangeBound();

        if (this.peek().kind === 'RBRACKET' || this.peek().kind === 'RCURLY') {
            this.consume();
        }

        // Half-open ranges: [* TO x] → lte/lt, [x TO *] → gte/gt
        if (from === null && to !== null) {
            const value = coerce(to);
            return {
                path: field,
                value_kind: inferValueKind(value),
                condition: { op: inclusive ? 'lte' : 'lt', value },
            };
        }
        if (from !== null && to === null) {
            const value = coerce(from);
            return {
                path: field,
                value_kind: inferValueKind(value),
                condition: { op: inclusive ? 'gte' : 'gt', value },
            };
        }
        if (from === null || to === null) return null;

        const fromValue = coerce(from);
        const toValue = coerce(to);
        return {
            path: field,
            value_kind: inferValueKind(fromValue),
            condition: {
                op: 'between',
                value: { from: fromValue, to: toValue },
            },
        };
    }

    // range_bound := '*' | WORD | QUOTED
    private parseRangeBound(): string | null {
        const tok = this.peek();
        if (tok.kind === 'WORD' && tok.value === '*') {
            this.consume();
            return null; // unbounded
        }
        if (tok.kind === 'WORD' || tok.kind === 'QUOTED') {
            this.consume();
            return tok.value;
        }
        return null;
    }

    // comparison := (GTE | GT | LTE | LT) atom
    private parseComparison(field: string): Condition | null {
        const opTok = this.consume();
        const op = { '>=': 'gte', '>': 'gt', '<=': 'lte', '<': 'lt' }[
            opTok.value
        ];
        const valTok = this.peek();
        if (valTok.kind !== 'WORD' && valTok.kind !== 'QUOTED') return null;
        this.consume();
        const value = coerce(valTok.value);
        return {
            path: field,
            value_kind: inferValueKind(value),
            condition: { op: op!, value },
        };
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build an eq (or like for wildcards) condition from a raw string value. */
function buildEqCondition(field: string, raw: string): Condition {
    const hasWildcard = raw.includes('*') || raw.includes('?');
    if (hasWildcard) {
        const value = raw.replace(/\*/g, '%').replace(/\?/g, '_');
        return {
            path: field,
            value_kind: 'string',
            condition: { op: 'like', value },
        };
    }
    const value = coerce(raw);
    return {
        path: field,
        value_kind: inferValueKind(value),
        condition: { op: 'eq', value },
    };
}

/** Coerce a raw string to boolean / number when applicable. */
function coerce(value: string): unknown {
    if (value === 'true') return true;
    if (value === 'false') return false;
    const n = Number(value);
    if (value !== '' && !isNaN(n)) return n;
    return value;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;

/** Infer value_kind from the already-coerced JS value. */
function inferValueKind(value: unknown): string {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string' && ISO_DATE_RE.test(value)) return 'datetime';
    return 'string';
}

const NEGATED_OP: Record<string, string> = {
    eq: 'neq',
    neq: 'eq',
    ne: 'eq',
    gt: 'lte',
    gte: 'lt',
    lt: 'gte',
    lte: 'gt',
};

/** Recursively negate a node (De Morgan's law for groups). */
function negate(node: Group | Condition): Group | Condition {
    if ('path' in node) {
        const neg = NEGATED_OP[node.condition.op];
        if (!neg) return node; // 'between', 'like', etc. — leave as-is
        return { ...node, condition: { ...node.condition, op: neg } };
    }
    // Flip AND↔OR and negate each child
    return {
        op: node.op === 'AND' ? 'OR' : 'AND',
        children: node.children.map(negate),
    };
}

/**
 * Merge two nodes under the given boolean operator.
 * Flattens consecutive same-operator groups instead of nesting them.
 */
function combine(
    op: 'AND' | 'OR',
    left: Group | Condition | null,
    right: Group | Condition | null,
): Group | Condition | null {
    if (left === null) return right;
    if (right === null) return left;

    if ('op' in left && left.op === op) {
        return { ...left, children: [...left.children, right] };
    }
    return { op, children: [left, right] };
}

/** Remove null children and unwrap single-child groups. */
function compact(node: Group | Condition): Group | Condition | null {
    if ('path' in node) return node;

    const children = node.children
        .map((c) => compact(c as Group | Condition))
        .filter((c): c is Group | Condition => c !== null);

    if (children.length === 0) return null;
    if (children.length === 1) return children[0];
    return { ...node, children };
}
