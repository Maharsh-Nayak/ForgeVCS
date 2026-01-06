# ForgeVCS
A Git-inspired version control engine built on immutable objects
and a DAG-based commit graph.

# ForgeVCS – Core Engine Design

ForgeVCS is a Git-inspired version control system built to understand and implement
**core version control concepts** such as immutability, content-addressable storage,
and commit history modeling.

This document describes the **design of the ForgeVCS engine**, independent of any UI
(CLI or Web). The same engine is intended to be reused by multiple interfaces.

---

## 1. High-Level Architecture

The project is divided into **engine and interfaces**:


### Design Principle
> The core engine must not know whether it is being used by a CLI or a web server.

This separation ensures clean architecture and reusability.

---

## 2. Core Concepts

ForgeVCS is based on **content-addressable storage** and **immutability**.

- All stored data is immutable
- Objects are identified by cryptographic hashes
- History is modeled as a directed acyclic graph (DAG)

---

## 3. Repository Layout

When a repository is initialized (`ForgeVCS init`), the following structure is created:


---

## 4. Object Model

Everything in ForgeVCS is stored as an **object**.

An object is:
- Immutable
- Stored as a single file
- Identified by the hash of its contents

### Object Types

#### 4.1 Blob Object
Represents the **contents of a file**.

- Stores raw file bytes
- Does not store filename or path
- Identical contents produce identical hashes

**Purpose:**
- Deduplication
- Integrity verification

---

#### 4.2 Tree Object
Represents a **directory structure**.

Each tree contains entries of the form:


Where:
- `type` is `blob` or `tree`
- `name` is filename or directory name
- `hash` references another object

Trees do **not** store file contents directly.

---

#### 4.3 Commit Object
Represents a **snapshot of the repository**.

A commit contains:
- Root tree hash
- Parent commit hash (none for first commit)
- Author
- Timestamp
- Commit message

Each commit is a **single node** in the commit history graph.

---

## 5. Commit History as a DAG

Commits form a **Directed Acyclic Graph (DAG)**.

- Each commit points to its parent commit(s)
- Branching creates multiple children
- Merging creates commits with multiple parents
- No cycles are allowed

Linear history is a special case of this graph.

---

## 6. The Index (Staging Area)

The index represents the **exact snapshot intended to be committed**.

It sits between:


### What the Index Stores

The index stores a mapping:


It represents **intent**, not history.

### Purpose of the Index
- Allows partial commits
- Separates working directory state from commit state
- Enables precise change tracking

---

## 7. Data Flow

### Adding Files
1. Read file contents from disk
2. Create a blob object
3. Store blob hash in the index

### Committing
1. Read entries from the index
2. Build tree objects representing directory structure
3. Create a commit object referencing the root tree
4. Update branch reference
5. Clear the index

---

## 8. Object Storage

### Storage Strategy
- One file per object
- Stored under `.ForgeVCS/objects/`
- Subdirectories based on hash prefix

Example:


### Object Format
Objects are stored in **binary format** with a structured layout:


Binary storage ensures:
- Language neutrality
- Performance
- Exact byte-level hashing

---

## 9. Integrity Guarantees

- Hashes ensure content integrity
- Objects are immutable
- Corruption can be detected by hash mismatch
- Identical content is stored only once

---

## 10. Design Principles Used

- Immutability
- Content-addressable storage
- Separation of concerns
- Engine-first architecture
- Future-proof data modeling

---

## 11. Explicit Non-Goals (v1)

The following features are intentionally excluded from the initial version:
- Networking (push/pull)
- Branch creation
- Merge and rebase
- Object compression
- Automatic corruption recovery

These can be added incrementally without changing the core model.

---

## 12. Summary

ForgeVCS’s engine models version control as a graph of immutable objects.
Commits reference trees, trees reference blobs, and all objects are stored
by hash. The index acts as a staging layer separating intent from history.

This design mirrors the fundamental ideas behind Git while remaining
simplified and educational.
