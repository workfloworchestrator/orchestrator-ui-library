# Architecture Decision Records

An Architecture Decision Record (ADR) captures a significant design decision for the Orchestrator UI 
Library: the context that led to it, the decision itself, and its consequences. Once accepted, an ADR
is not rewritten — if a decision is later changed, a new ADR supersedes it and both are kept for history.

## Statuses

| Status | Meaning |
|--------|---------|
| Proposed | Written up, still under discussion. An ADR is Proposed for as long as its pull request is open. |
| Accepted | Agreed and in effect. Merging the pull request is what accepts an ADR, so set this in the branch before merge. |
| Rejected | Considered and decided against. Merged anyway, so the reasoning is on record and the option isn't reopened without new arguments. |
| Superseded | Replaced by a later ADR. The record itself still stands as written; see [Changing an earlier decision](#changing-an-earlier-decision). |

The status on the record is the authoritative one — the table below repeats it for browsing, so update both.

## Records

The current records are listed below and are also available in the navigation.

| ID | Title                           |
|----|---------------------------------|
| [0001](records/0001-record-architecture-decisions.md) | Record architecture decisions   |
| [0002](records/0002-typescript-rules.md) | TypeScript guidelines and rules |
| [0003](records/0003-nextjs.md) | Next.js                         |
| [0004](records/0004-turbo-repo-and-dependencies.md) | Turbo Repo and dependencies     |
| [0005](records/0005-component-naming.md) | Component naming                |
| [0006](records/0006-types-extended.md) | Proposal on types               |
| [0007](records/0007-component-naming.md) | Proposal on component naming    |
| [0008](records/0008-typescript-conventions.md) | TypeScript conventions          |

## Adding a new ADR

1. Copy [`template.md`](records/template.md) to a new file named `NNNN-short-title.md` in this directory, using the next sequential number (zero-padded to 4 digits).
2. Fill in Context, Decision, and Consequences.
3. Add a row to the table above.
4. Add the page to `nav:` in `mkdocs.yml`. The template itself is deliberately not listed there.

Numbers are claimed when the file is written, so two open pull requests can end up on the same one. Whoever merges second renumbers.

## Changing an earlier decision

An accepted ADR is never rewritten, because the reasoning it records was true at the time and stays useful. To change a decision:

1. Write a new ADR for the new decision, with a **Supersedes** line linking to the old one.
2. In the old ADR, set the status to `Superseded` and add a **Superseded by** line linking to the new one. This is the only edit ever made to an accepted record — leave its Context, Decision, and Consequences alone.
3. Update the status of both records in the table above.
